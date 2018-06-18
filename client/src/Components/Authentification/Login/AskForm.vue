<template>
  <div>
    <b-alert :show="showError" variant="danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{error}}</li>
      </ul>
    </b-alert>
    <b-form @submit.prevent="onSubmit" >
      <b-form-group  id="emailGroup"
        label="Email"
        label-for="email"
      >
        <b-form-input id="email"
          type="text"
          v-model.trim="form.email"
          required
          placeholder="Entrez votre email"
          :state="statusField($v.form.email)"
          @input="$v.form.email.$touch()"
        />
        <b-form-invalid-feedback id="emailFeedback">
          L'email n'st pas valide.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
        :disabled="$v.form.$invalid">
        Envoyer
      </b-button>
    </b-form>
  </div>
</template>

<script>
  import { AUTH_LOGIN_REQUEST, AUTH_LOGIN_SUCCESS } from '../../../Store/auth/mutation-types'
  import { validationMixin } from "vuelidate"
  import { required, email } from 'vuelidate/lib/validators'

  export default {
    name: 'ask-form',
    props: ['type'],
    data() {
      return {
        form: {
          email: '',
          password: ''
        },
        type: '',
        showError: false,
        errors: []
      }
    },
    mixins: [
      validationMixin
    ],
    validations: {
      form: {
        email: {
          required,
          required
        },
      }
    },
    methods: {
      statusField(fieldState) {
        if (!fieldState.$dirty) {
          return null
        }
        return !fieldState.$invalid
      },
      onSubmit(e) {
        const { username, password } = this.form
        this.$store.dispatch(AUTH_LOGIN_REQUEST, {username, password})
        .then((response) => {
          this.$socket.emit('AUTH_LOGIN', {username: username})
          this.flash('Bienvenue ' + username + ' !', 'success', {timeout: 5000})
          this.$router.push('/')

        }, (error) => {
          this.setError(error)
        })
      },
      setError(error) {
        this.showError = true
        this.errors = [error]
      }
    }
  }
</script>
