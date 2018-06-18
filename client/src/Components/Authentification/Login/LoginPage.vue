<template>
  <div>
    <h2>{{title}}</h2>
    <login-form v-if="type==='login'"></login-form>
    <ask-form type="password" v-if="type!=='login'"></ask-form>
  </div>
</template>

<script>
  import Vue from 'vue'
  import LoginForm from './LoginForm.vue'
  import AskForm from './AskForm.vue'
  
  export default {
    components: {
      LoginForm,
      AskForm
    },
    data() {
      return {
        title: 'Connexion',
        type: 'login'
      }
    }
  }
</script>
