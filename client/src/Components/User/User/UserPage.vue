<template>
  <b-container fluid v-if="userPage">
    <h2>{{relation}}</h2>
    <user-connexion :connexion="connexion" />

    <b-row>
      <b-col md="8">
        <user-view :user="user" />
      </b-col>
      <b-col md="4">
        <user-page-actions v-if="isAuthenticated && !isUser"
          :actor="username"
          :receptor="userPage"
          :relationStatus="relationStatus"
        />
         <profile-view-interest  :user="user"/>
          <user-relations
            :actor="user.username"
            :relationStatus="relationStatus"
          />
        <user-relations
          :relationStatus="relationStatus"
          :relations="relations"
          :actor="username"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import Vue from 'vue'
  import store from '../../../Store/store'
  import { mapState, mapGetters } from 'vuex'
  import callApi from '../../../Api/callApi'
  import { NOTIFICATION_CREATE_REQUEST } from '../../../Store/notification/mutation-types'
  import { USER_USER_REQUEST } from '../../../Store/user/mutation-types'
  import UserPageActions from './UserPageActions.vue'
  import UserRelations from '../All/UserRelations.vue'
  import UserView from './UserView.vue'
  import UserConnexion from '../All/UserConnexion.vue'
  import ProfileViewInterest from '../Profile/ProfileView/ProfileViewInterest.vue'

  export default {
    data() {
      return ({
        error: null,
        userPage: null,
        user: null,
        connexion: null,
        relations: null,
      })
    },
    components: {
      UserPageActions,
      UserRelations,
      UserView,
      UserConnexion,
      ProfileViewInterest
    },
    // Pour un user, on n'enregistre pas les données dans le state, donc on appelle l'API directement
    beforeRouteEnter(to, from, next) {
      callApi({url: '/user/user/' + to.params.username})
      .then((resp, error) => {
        next(vm => vm.setData(resp, error))
      })
    },
    beforeRouteUpdate(to, from, next) {
      this.userPage = null
      this.user = null
      this.relations = null
      callApi({url: '/user/user/' + to.params.username})
      .then((resp, error) => {
        this.setData(resp, error)
        next()
      })
    },
    methods: {
      setData(response, error) {
        // récupération des données de la callApi
        if (error) {
          // @TODO : redirection page d'erreur
          console.log('UserPage ERROR in dataFetching', error)
          return
        }
        const resp = response.data.data
        this.userPage = resp.username
        const user = {
          username: resp.username,
          firstname: resp.firstname,
          lastname: resp.lastname,
          age: resp.age,
          resume: resp.resume,
          city: resp.city,
          zip: resp.zip,
          visibility: resp.visibility,
          gender: resp.gender,
          orientation: resp.orientation,
          interests: resp.interests,
          avatar: resp.avatar,
          gallery: resp.gallery
        }
        this.user = user
        const relations = {
          friends: resp.friends,
          likes: resp.likes,
          likers: resp.likers,
          blocked: resp.blocked,
          blockers: resp.blockers
        }
        this.relations = relations

        this.connexion = {
          username: resp.username,
          last_logout: resp.last_logout
        }

        // incrémentation du nombre de visites sur la page + notification
        callApi({url: '/user/addvisit/' + this.userPage})
        .then((resp) => {
          this.$socket.emit('USER_VISITADD', this.userPage)
          let message = ''
          if (!this.isAuthenticated) {
            message = this.visitor
          }
          message += ' a visité votre profil.'
          const notif = {
            username: this.userPage,
            type: 'visit',
            message: message
          }
          if (this.isAuthenticated) {
            notif.origin = this.getUsername
          }
          this.$store.dispatch(NOTIFICATION_CREATE_REQUEST, notif)
          .then((response) => {
            this.$socket.emit('NOTIFICATION_SEND', response)
          }, (error) => {
            console.log('UserPage mounted ERROR: ', error)
          })
        }, (err) => {
          console.log(err)
        })
      },
    },
    computed: {
      ...mapGetters([
        'isAuthenticated',
        'getUsername'
      ]),
      ...mapState({
        likes: state => state.auth.profile.likes ? state.auth.profile.likes : [],
        likers: state => state.auth.profile.likers ? state.auth.profile.likers : [],
        friends: state => state.auth.profile.friends ? state.auth.profile.friends : [],
        blocked: state => state.auth.profile.blocked ? state.auth.profile.blocked : [],
        blockers: state => state.auth.profile.blockers ? state.auth.profile.blockers : [],
        username: state => state.auth.profile.username ? state.auth.profile.username : '',
      }),
      isUser() {
        return this.isAuthenticated && this.username === this.userPage
      },
      visitor() {
        return this.isAuthenticated ? this.getUsername : 'Un visiteur anonyme'
      },
      isLiked() {
        return this.likes.find(u => u.username === this.userPage) ? true : false
      },
      isLiker() {
        return this.likers.find(u => u.username === this.userPage) ? true : false
      },
      isFriend() {
        return this.friends.find(u => u.username === this.userPage) ? true : false
      },
      isBlocked() {
        return this.blocked.find(u => u.username === this.userPage) ? true : false
      },
      isBlocker() {
        return this.blockers.find(u => u.username === this.userPage) ? true : false
      },
      relationStatus() {
        return {
          isLiked: this.isLiked,
          isLiker: this.isLiker,
          isFriend: this.isFriend,
          isBlocked: this.isBlocked,
          isBlocker: this.isBlocker,
          isUser: this.isUser,
        }
      },
      relation() {
        let txt = this.userPage
        if (this.username !== '') {
          if (this.isUser) {
            txt += " : c'est vous !"
          } else {
            if (this.isFriend === true) {
              txt += ' est votre ami.'
            } else if (this.isLiker === true) {
              txt += ' aimerait devenir votre ami.'
            } else if (this.isLiked === true) {
              txt += ', que vous aimez tant !!!'
            }
            if (this.isBlocked === true) {
              txt += ' Vous l\'avez bloqué...'
            }
          }
        }
        return txt
      }
    },
  }
</script>
