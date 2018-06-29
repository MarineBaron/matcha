<template>

  <div>
    <div v-if="isAuthenticated && !isUser" class="float-right">
      <user-button-action v-if="!isLiked && !isFriend"
        type="like"
        :actor="getUsername"
        :receptor="username"
      />
      <user-button-action v-if="isLiked||isFriend"
        type="unlike"
        :actor="getUsername"
        :receptor="username"
      />
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
        likes: state => state.auth.profile.likes ? state.auth.profile.likes : [],
        likers: state => state.auth.profile.likers ? state.auth.profile.likers : [],
        friends: state => state.auth.profile.friends ? state.auth.profile.friends : [],
      }),
      isLiked() {
        return this.likes.find(u => u.username === this.username) ? true : false
      },
      isLiker() {
        return this.likers.find(u => u.username === this.username) ? true : false
      },
      isFriend() {
        return this.friends.find(u => u.username === this.username) ? true : false
      },
      isUser() {
        return this.username === this.getUsername
      },
      relation() {
        if (this.isUser === true) {
          return this.username
        }
        if (this.username === this.getUsername) {
          return this.username + " : c'est vous !"
        }
        if (this.isFriend === true) {
          return this.username + ' est votre ami.'
        }
        if (this.isLiker === true) {
          return this.username + ' aimerait devenir votre ami.'
        }
        if (this.isLiked === true) {
          return this.username + ', que vous aimez tant !!!'
        }
        return this.username
      }
    }
  }
</script>
