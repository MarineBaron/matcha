<template>
  <div>
    <h2>{{title}}</h2>
    <login-form></login-form>
  </div>
</template>

<script>
  import Vue from 'vue'
  import LoginForm from './LoginForm.vue'
  
  export default {
    components: {
      LoginForm
    },
    data() {
      return {
        title: 'Login Page'
      }
    }
  }
</script>
