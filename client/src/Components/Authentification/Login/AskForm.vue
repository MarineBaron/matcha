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
  import { AUTH_ASK_REQUEST } from '../../../Store/auth/mutation-types'
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
        const email = form.email
        this.$store.dispatch(AUTH_ASK_REQUEST, {type: type, email: email})
        .then((response) => {
          console.log(response)
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
