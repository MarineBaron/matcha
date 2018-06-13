<template>
  <b-nav-item @click="logout">Logout</b-nav-item>
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
            this.$router.push('/login')
          })
      }
    }
  }
</script>

<style>
</style>
