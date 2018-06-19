<template>
  <div>
    <h2>{{title}}</h2>
    <register-form></register-form>
  </div>
</template>

<script>
  import RegisterForm from './RegisterForm.vue'
  
  export default {
    components: {
      RegisterForm
    },
    data() {
      return {
        title: 'Enregistrement'
      }
    }
  }
</script>
