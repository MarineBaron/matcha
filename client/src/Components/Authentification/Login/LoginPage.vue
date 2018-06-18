<template>
  <div>
    <h2>{{title}}</h2>
    <login-form v-if="type==='login'"></login-form>
    <ask-form :type="type" v-else></ask-form>
    <b-button v-if="type==='login'" variant="primary" @click="changeForm('password')">
      Mot de passe oublié
    </b-button>
    <b-button v-if="type==='login'" variant="primary" @click="changeForm('username')">
      Pseudo oublié
    </b-button>
    <b-button v-if="type==='login'" variant="primary" @click="changeForm('confirmation')">
      Nouveau lien de confirmation
    </b-button>
    <b-button v-if="type!=='login'"variant="primary" @click="changeForm('login')">
      Connexion
    </b-button>
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
    },
    methods: {
      changeForm(type) {
        console.log(type)
        this.type = type
      },
    }
  }
</script>
