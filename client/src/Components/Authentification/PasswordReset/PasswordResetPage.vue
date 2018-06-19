<template>
  <div>
    <h2>{{title}}</h2>
    <password-reset-form />
  </div>
</template>

<script>
  import Vue from 'vue'
  import PasswordResetForm from './PasswordResetForm.vue'
  
  export default {
    components: {
      PasswordResetForm
    },
    data() {
      return {
        title: 'Réinitialisation du mot de passe'
      }
    }
  }
</script>
