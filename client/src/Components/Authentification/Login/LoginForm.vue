<template>
  <div>
    <b-alert :show="showError" variant="danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{error}}</li>
      </ul>
    </b-alert>
    <b-form @submit.prevent="onSubmit" >
      <b-form-group  id="usernameGroup"
        label="Pseudo"
        label-for="username"
      >
        <b-form-input id="username"
          type="text"
          v-model.trim="form.username"
          required
          placeholder="Entrez votre pseudo"
          :state="statusField($v.form.username)"
          @input="$v.form.username.$touch()"
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
          placeholder="Entrez votre mot de passe"
          :state="this.statusField($v.form.password)"
          @input="$v.form.password.$touch()"
        />
        <b-form-invalid-feedback id="passwordFeedback">
          Ce champs est requis et doit contenir entre 3 et 20 caractères.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
        :disabled="$v.form.$invalid">
        Connexion
      </b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
  import { AUTH_LOGIN_REQUEST, AUTH_LOGIN_SUCCESS } from '../../../Store/auth/mutation-types'
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'

  export default {
    name: 'login-form',
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        showError: false,
        errors: []
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
          let message = ''
          switch(error) {
            case 'INEXISTANT LOGIN':
              message = 'Ce pseudo est inexistant.'
            break;
            case 'UNCONFIRMED USER':
              message = 'Vous devez confirmer votre inscription.'
            break;
            case 'BANISHED USER':
              message = 'Vous avez été banni.'
            break;
            case 'BAD CREDENTIALS':
              message = 'Votre pseudo et votre mot de passe ne concordent pas.'
            break;
            default :
              message = 'Vos identifiants sont incorrects.'
            break;
          this.setError(message)
        })
      },
      setError(error) {
        this.showError = true
        this.errors = [error]
      }
    }
  }
</script>
