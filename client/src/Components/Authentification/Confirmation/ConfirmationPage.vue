<template>
  <div>
    <h2>{{title}}</h2>
    <div>{{text}}</div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { AUTH_CONFIRM_REQUEST } from '../../../Store/auth/mutation-types'

  export default {
    data() {
      return {
        username: '',
        token: '',
        title: 'Confirmation',
        text: ''
      }
    },
    mounted() {
      this.username = this.$route.params.username
      this.token = this.$route.params.token
      this.$store.dispatch(AUTH_CONFIRM_REQUEST, {username: this.username, token: this.token})
      .then((response) => {
        this.flash('Votre inscription a été confirmée, connectez-vous !', 'success', {timeout: 5000})
        this.$router.push('/login')
      }, (error) => {
        this.text = "Une erreur est survenue lors de la confirmation de votre inscription."
      })
    }
  }
</script>
