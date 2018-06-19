<template>
  <div>
    <div>{{text}}</div>
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
          email: ''
        },
        showError: false,
        errors: [],
        text: this.getText()
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
      getText() {
        let text = ''
        switch (this.type) {
          case 'confirmation':
            text = 'Entrez votre email, et nous vous renverrons un lien de confirmation de votre inscription.'
          break
          case 'password':
            text = 'Entrez votre email, et nous vous renverrons un lien vous permettant de modifier votre mot de passe.'
          break
          case 'username':
            text = 'Entrez votre email, et nous vous renverrons votre pseudo.'
          break
        }
        return text
      },
      statusField(fieldState) {
        if (!fieldState.$dirty) {
          return null
        }
        return !fieldState.$invalid
      },
      onSubmit(e) {
        const email = this.form.email
        this.$store.dispatch(AUTH_ASK_REQUEST, {type: this.type, email: email})
        .then((response) => {
          let message = ''
          switch(this.type) {
            case 'username':
              this.flash('Un email contenant votre pseudo vous a été envoyé.', 'primary', {timeout: 5000})
            break
            case 'password':
              this.flash('Un email contenant un lien de modification de votre mot de passe vous a été envoyé.', 'primary', {timeout: 5000})
            break
            case 'password':
              this.flash('Un email de confirmation de votre inscription vous a été envoyé.', 'primary', {timeout: 5000})
            break
          }
          this.$emit('change-form', 'login')

        }, (error) => {
          let message = ''
          switch(error) {
            case 'CONFIRMED USER':
              message = 'Votre compte a déjà été confirmé, vous pouvez vous connecter.'
            break;
            case 'BANISHED USER':
              message = 'Vous avez été banni.'
            break;
            case 'USER NOT FOUND':
              message = 'Aucun compte ne correspond à cette adresse email.'
            break;
            default :
              message = 'Un problème est survenu. Réessayez...'
            break;
          }
          if (error === 'CONFIRMED USER') {
            this.flash(message, 'success', {timeout: 5000})
            this.$emit('change-form', 'login')
          } else {
            this.setError(message)
          }
        })
      },
      setError(error) {
        this.showError = true
        this.errors = [error]
      }
    }
  }
</script>
