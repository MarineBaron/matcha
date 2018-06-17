<template>
  <div>
    <h2>{{title}}</h2>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { USER_CONFIRM_REQUEST } from '../../../Store/auth/mutation-types'

  export default {
    data() {
      return {
        username: '',
        token: '',
        title: 'Confirmation'
      }
    },
    created() {
      this.username = his.$route.params.username
      this.token = his.$route.params.token
    },
    mounted() {
      this.$store.dispatch(AUTH_CONFIRM_REQUEST, {username: this.username, token: this.token})
      .then((response) => {
        this.$router.push('/login')
      }, (error) => {
        this.setError(error)
      })
    }
  }
</script>
