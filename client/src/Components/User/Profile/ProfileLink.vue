<template>
  <b-nav-item href="/profile">{{username}}</b-nav-item>
</template>

<script>
  import bNavItem from 'bootstrap-vue/es/components/nav/nav-item'
  import { mapGetters, mapState } from 'vuex'
  
  export default {
    components: {
      bNavItem
    },
    computed:{
      ...mapGetters([
        'getProfile',
        'isProfileLoaded'
      ]),
      ...mapState({
        authLoading: state => state.auth.status === 'loading',
        username: state => `${state.user.profile.username}`
      })
    }
  }
</script>
