<template>
  <div>
    <b-form @submit="onSubmit" >
      <b-form-group id="usernameGroup"
        label="Pseudo"
        label-for="username"
      >
        <b-form-input id="username"
          type="text"
          v-model.trim="form.username"
          required
          placeholder="Enter your username"
          :state="!$v.form.username.$invalid"
        />
        <b-form-invalid-feedback id="usernameFeedback">
          Ce champs est requis et doit contenir entre 3 et 20 caractères.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group id="passwordGroup"
        label="Mot de passe"
        label-for="password"
      >
        <b-form-input id="password"
          type="password"
          v-model.trim="form.password"
          required
          placeholder="Enter your password"
          :state="!$v.form.password.$invalid"
        />
        <b-form-invalid-feedback id="passwordFeedback">
          Ce champs est requis et doit contenir entre 3 et 20 caractères.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
        :disabled="$v.form.$invalid">
      Connexion</b-button>
    </b-form>
  </div>
</template>

<script>
  import { AUTH_REQUEST, AUTH_SUCCESS } from '../../../Store/auth/mutation-types'
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'
  
  export default {
    name: 'login-form',
    data() {
      return {
        form: {}
      }
    },
    mixins: [
      validationMixin
    ],
    validations: {
      form: {
        username: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(20),
        },
        password: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(20),
        },
      }
    },
    methods: {
      onSubmit(e) {
        e.preventDefault()
        const { username, password } = this.form
        this.$store.dispatch(AUTH_REQUEST, {username, password})
        .then(() => {
          this.$socket.emit(AUTH_SUCCESS, {username: username})
          this.flash('Bienvenue ' + username + ' !', 'success', {timeout: 2000})
          this.$router.push('/')
        })
        .catch(() => {
          this.flash('Vos identifiants sont incorrects.', 'error', {timeout: 2000})
          this.$router.push('/login')
        })
      }
    }
  }
</script>
