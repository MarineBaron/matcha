<template>
  <div>
    <b-alert :show="showError" variant="danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{error}}</li>
      </ul>
    </b-alert>
    <b-alert :show="showRegistered" variant="success">
      Vous avez été enregistré, vous devez confirmer votre inscription en cliquant sur le lien dans le mail que nous vous avons envoyé.
    </b-alert>
    <b-form v-if="showForm" @submit.prevent="onSubmit" >
      <b-form-group id="usernameGroup"
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
      <b-form-group id="emailGroup"
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
          L'email n'est pas correct.
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
  import { USER_REGISTER_REQUEST } from '../../../Store/user/mutation-types'
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength, sameAs, email } from 'vuelidate/lib/validators'

  export default {
    name: 'register-form',
    data() {
      return {
        form: {
          username: '',
          email: '',
          password: '',
          password2: '',
        },
        showForm: true,
        showRegistered: false,
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
        email: {
          required,
          email,
        },
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
        const { username, email, password } = this.form
        this.$store.dispatch(USER_REGISTER_REQUEST, {username, email, password})
          .then((response) => {
            this.showForm = false
            this.showError = false
            this.showRegistered = true
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
