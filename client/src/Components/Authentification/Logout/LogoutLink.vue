<template>
  <b-nav-item @click.prevent="logout">Déconnexion</b-nav-item>
</template>

<script>
  import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'
  import { AUTH_LOGOUT } from '../../../Store/auth/mutation-types'
  import { CHAT_CLOSE_ALLROOMS } from '../../../Store/chat/mutation-types'
  import { mapGetters, mapState } from 'vuex'
  export default {
    components: {
      bNavItem
    },
    methods: {
      logout(e) {
        const username = this.getProfile.username
        this.$store.dispatch(AUTH_LOGOUT, username)
          .then(() => {
            this.$store.dispatch(CHAT_CLOSE_ALLROOMS)
            this.$socket.emit('AUTH_LOGOUT', this.getProfile)
            this.$router.push('/login')
          })
      }
    },
    computed: {
      ...mapGetters([
        'getProfile',
      ])
    }
  }
</script>
