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
      <b-form-group id="password2Group"
        label="Confirmez votre mot de passe"
        label-for="password2"
      >
        <b-form-input id="password2"
          type="password"
          v-model.trim="form.password2"
          required
          placeholder="Enter your password"
          :state="!$v.form.password2.$invalid"
        />
        <b-form-invalid-feedback id="password2Feedback">
          Ce champs est requis et doit contenir entre 3 et 20 caractères.
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
  import { required, minLength, maxLength } from 'vuelidate/lib/validators'

  export default {
    name: 'register-form',
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
        password2: {
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
        this.$store.dispatch(USER_REGISTER_REQUEST, {username, password})
          .then(() => {
            this.flash('Vous avez été enregistré, veuillez entrer vos identifiants de connexion.', 'success', {timeout: 2000})
            this.$router.push('/login')
          })
          .catch(() => {
            this.flash('Ce pseudo existe déjà, choisissez un autre pseudo', 'error', {timeout: 2000})
          })
      }
    }
  }
</script>
