<template>
  <div>
    <b-alert :show="showError" variant="danger">
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{error}}</li>
      </ul>
    </b-alert>
    <b-alert :show="showUpdate" variant="success">
      Tout va bien.
    </b-alert>
    <b-form :show="showForm" @submit.prevent="onSubmit">
      <b-form-input id=""
        type="text"
        v-model.trim="form.firstname"
        required
        placeholder="Votre prénom"
      />
      <b-form-input id="form"
        type="text"
        v-model.trim="form.lastname"
        required
        placeholder="Votre nom"
      />
      <b-button
        type="submit"
        variant="primary">
      Valider</b-button>
    </b-form>
  </div>
</template>

<script>
  import { USER_ACCOUNT_REQUEST } from '../../../../Store/user/mutation-types'
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'

  export default {
    props: ['user'],
    data() {
      return {
        form: {
          firstname: '',
          lastname: '',
        },
        showUpdate: false,
        showForm: true,
        show: false,
        showError: false,
        errors: []
      }
    },
    mixins: [
      validationMixin
    ],
    validations: {
      form: {
        firstname: {
          required,
          maxLength: maxLength(20),
        },
        lastname: {
          required,
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
        console.log('submit')
        const { firstname, lastname } = this.form
        const data = {
          firstname: firstname,
          lastname: lastname,
          username: this.user.username
        }
        this.$store.dispatch(USER_ACCOUNT_REQUEST, data)
          .then((response) => {
            this.showForm = false
            this.showError = false
            this.showUpdate = true
          }, (error) => {
            let message = ''
            switch(error) {
              default:
                message = 'Votre mise à jour a échoué. Veuillez réessayer SVP.'
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
