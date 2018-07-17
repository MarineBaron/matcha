<template>
  <b-navbar toggleable="sm" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand :to="{path: '/'}">Matcha</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item  v-for="link in links" :key="links.url" v-if="!link.needAuthenticated||isAuthenticated" :to="{path: link.path}">{{link.text}}</b-nav-item>
        <b-nav-item v-if="getRole === 'admin'" :to="{path: '/admin'}">Gestion</b-nav-item>
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
        {text: 'Recherche', path: '/search', needAuthenticated: true},
        {text: 'Forum', path: '/forum', needAuthenticated: true},
        {text: 'A propos', path: '/about'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      //'getProfile',
      'isAuthenticated',
      'isProfileLoaded',
      'getRole'
    ]),
    ...mapState({
      authLoading: state => state.auth.status === 'loading',
      username: state => this.isProfileLoaded ? state.auth.profile.username : '',
    })
  }
}
</script>
