<template>
  <b-nav-item @click="logout">Déconnexion</b-nav-item>
</template>

<script>
  import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'
  import { AUTH_LOGOUT } from '../../../Store/auth/mutation-types'
  export default {
    components: {
      bNavItem
    },
    methods: {
      logout(e) {
        e.preventDefault()
        this.$store.dispatch(AUTH_LOGOUT)
          .then(() => {
            this.$socket.emit(AUTH_LOGOUT, {username: JSON.parse(localStorage.getItem('profile')).username})
            this.$router.push('/login')
          })
      }
    }
  }
</script>
