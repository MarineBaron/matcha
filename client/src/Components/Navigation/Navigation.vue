<template>
  <b-navbar toggleable="sm" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">Matcha</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav v-for="link in links" :key="links.url">
        <b-nav-item :to="{path: link.path}">{{link.text}}</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <login-link v-if="!isAuthenticated"></login-link>
        <register-link v-if="!isAuthenticated"></register-link>
        <profile-link v-if="isAuthenticated" ></profile-link>
        <logout-link v-if="isAuthenticated" ></logout-link>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { Navbar } from 'bootstrap-vue/es/components'
import LoginLink from '../Authentification/Login/LoginLink.vue'
import RegisterLink from '../Authentification/Register/RegisterLink.vue'
import ProfileLink from '../User/Profile/ProfileLink.vue'
import LogoutLink from '../Authentification/Logout/LogoutLink.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'navigation',
  components: {
    LoginLink,
    RegisterLink,
    ProfileLink,
    LogoutLink,
    Navbar
  },
  data () {
    return {
      links: [
        {text: 'Home', path: '/'},
        {text: 'Search', path: '/search'},
        {text: 'Forum', path: '/forum'},
        {text: 'About', path: '/about'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getProfile',
      'isAuthenticated',
      'isProfileLoaded'
    ]),
    ...mapState({
      authLoading: state => state.auth.status === 'loading',
      username: state => isProfileLoaded ? `${state.user.profile.username}` : ''
    })
  }
}
</script>
