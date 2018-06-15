<template>
  <div>
    <home-anonymous v-if="!isAuthenticated" />
    <home-authenticated v-else />
  </div>
</template>

<script>
import HomeAnonymous from './HomeAnonymous.vue'
import HomeAuthenticated from './HomeAuthenticated.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  components: {
    HomeAnonymous,
    HomeAuthenticated
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
    ]),
    ...mapState({
      token: state => state.auth.token,
    })
  },
}
</script>
