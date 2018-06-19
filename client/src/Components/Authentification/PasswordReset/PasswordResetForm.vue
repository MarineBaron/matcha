<template>
  <div>
    <b-alert :show="showError" variant="danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{error}}</li>
      </ul>
    </b-alert>
    <b-form @submit.prevent="onSubmit" >
      <b-form-group id="passwordGroup"
        label="Mot de passe"
        label-for="password"
      >
        <b-form-input id="password"
          type="password"
          v-model.trim="form.password"
          required
          placeholder="Entrez votre mot de passe"
          :state="statusField($v.form.password)"
          @input="$v.form.password.$touch()"
        />
        <b-form-invalid-feedback id="passwordFeedback">
          Ce champs est requis et doit contenir entre 3 et 20 caractères.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group id="password2Group"
        label="Confirmez votre mot de passe"
        label-for="password2"
      >
        <b-form-input id="password2"
          type="password"
          v-model.trim="form.password2"
          required
          placeholder="Entrez votre mot de passe"
          :state="statusField($v.form.password2)"
          @input="$v.form.password2.$touch()"
        />
        <b-form-invalid-feedback id="password2Feedback">
          Les mots de passe ne sont pas identiques.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
        :disabled="$v.form.$invalid">
      Valider</b-button>
    </b-form>
  </div>
</template>

<script>
  import { AUTH_PASSWORD_RESET_REQUEST } from '../../../Store/auth/mutation-types'
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'

  export default {
    name: 'register-form',
    data() {
      return {
        form: {
          password: '',
          password2: '',
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
        password: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(20),
        },
        password2: {
          sameAsPassword: sameAs('password'),
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
        const { password } = this.form
        const { username, token } = this.$route.params
        this.$store.dispatch(AUTH_PASSWORD_RESET_REQUEST, {username, token, password})
          .then((response) => {
            let message = 'Votre mot de passe a été réinitialisé. Connectez-vous !'
            this.flash(message, 'success', {timeout: 5000})
            this.$router.push('/login')
          }, (error) => {
            let message = ''
            switch(error) {
              case 'USER NOT FOUND':
                message = 'Votre pseudo n\'existe pas.'
              break
              case 'BAD TOKEN':
                message = 'Le lien de ré-imitialisation du mot de passe est incorrect.'
              break
              case 'BANISHED USER':
                message = 'Vous avez été banni.'
              break
              case 'UNCONFIRMED USER':
                message = 'Vous devez au préalable confirmer votre inscription.'
              break
              default :
                message = 'Le lien de ré-imitialisation du mot de passe est incorrect.'
              break
            }
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
