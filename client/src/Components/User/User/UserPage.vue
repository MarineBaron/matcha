<template>

  <div>
    <div v-if="isAuthenticated && !isUser" class="float-right">
      <user-button-action v-if="!isLiked" type="like" username="username"/>
      <user-button-action v-if="isLiked||isFriend" type="unlike" username="username"/>
    </div>
    UserPage: {{relation}}
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import callApi from '../../../Api/callApi'
  import Vue from 'vue'
  import store from '../../../Store/store'

  import UserButtonAction from '../All/UserButtonAction.vue'

  export default {
    data() {
      return ({
        username: this.$route.params.username
      })
    },
    components: {
      UserButtonAction
    },
    beforeRouteEnter: function(to, from, next) {
      callApi({url: '/user/addvisit/' + to.params.username})
      .then((resp) => {
        Vue.prototype.$socket.emit('USER_VISITADD', to.params.username)
        next()
      }, (err) => {
        console.log(err)
      })
    },
    computed: {
      ...mapGetters([
        'isAuthenticated',
        'getUsername'
      ]),
      ...mapState({
        isLiked: state => {
          return (!state.auth.profile.likes || ! state.auth.profile.likes.length)
            ? false
            : (state.auth.profile.likes.find(u => u.username === this.username) ? true : false)
        },
        isLiker: state => {
          return (!state.auth.profile.likers || ! state.auth.profile.likers.length)
            ? false
            : (state.auth.profile.likers.find(u => u.username === this.username) ? true : false)
        },
        isFriend: state => {
          return (!state.auth.profile.friends || ! state.auth.profile.friends.length)
            ? false
            : (state.auth.profile.friends.find(u => u.username === this.username)? true : false)
        },
      }),
      isUser() {
        return this.username === this.getUsername
      },
      relation() {
        if (!this.isUser) {
          return this.username
        }
        if (this.username === this.getUsername) {
          return this.username + " : c'est vous !"
        }
        if (this.isFriend) {
          return this.username + ' est votre ami.'
        }
        if (this.isLiker) {
          return this.username + ' aimerait devenir votre ami.'
        }
        if (this.isLiked) {
          return this.username + ', que vous aimez tant !!!'
        }
        return this.username
      }
    }
  }
</script>
