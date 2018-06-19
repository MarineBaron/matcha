<template>
  <b-nav-item @click="logout">Déconnexion</b-nav-item>
</template>

<script>
  import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'
  import { AUTH_LOGOUT } from '../../../Store/auth/mutation-types'
  import { mapGetters, mapState } from 'vuex'
  export default {
    components: {
      bNavItem
    },
    methods: {
      logout(e) {
        e.preventDefault()
        const username = this.getProfile.username
        this.$store.dispatch(AUTH_LOGOUT)
          .then(() => {
            this.$socket.emit('AUTH_LOGOUT', {username: username})
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
