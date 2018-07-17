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
      <b-form-input id="form"
        type="text"
        required
        v-model.trim="form.firstname"
        placeholder="Votre prénom"
        :state="statusField($v.form.firstname)"
        @input="$v.form.firstname.$touch()"
        />
      <b-form-invalid-feedback id="firstnameFeedback">
          Ce champ est requis et ne doit pas dépasser 20 caractères.
      </b-form-invalid-feedback>
      <b-form-input id="form"
        type="text"
        required
        v-model.trim="form.lastname"
        placeholder="Votre nom"
        :state="statusField($v.form.lastname)"
        @input="$v.form.lastname.$touch()"
      />
      <b-form-invalid-feedback id="lastnameFeedback">
        Ce champ est requis et ne doit pas dépasser 20 caractères.
      </b-form-invalid-feedback>
      <b-button
        type="submit"
        variant="primary"
        :disabled="$v.form.$invalid">
      Valider</b-button>
    </b-form>
  </div>
</template>

<script>
  import { USER_ACCOUNT_REQUEST } from '../../../../Store/user/mutation-types'
  import { validationMixin } from "vuelidate"
  import { required, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'
  import { mapState } from 'vuex'
  import callApi from '../../../../Api/callApi'

  export default {
    props: ['user'],
    data() {
      return {
        form: {
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          age: this.user.age,
          //genders: ,
          //orientation: ,
          //interests: ,
          email: this.user.email,
          city: this.user.city,
          zip: this.user.zip,


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
          minLength: minLength(1),
          maxLength: maxLength(20),
        },
        lastname: {
          minLength: minLength(1),
          maxLength: maxLength(20),
        },
      }
    },
    created: function () {
      console.log("avant lecture des genders")
      callApi({url: 'user/genders'})
      .then((resp, err) => {
        if (!resp.data.success) {
         reject(resp.data.message)
       } else {
         resolve(resp.data.data)
       }
      })
      .catch(err => {
       reject(err)
      })
     console.log("lecture des genders", resp, err)
    },

    methods: {
      statusField(fieldState) {
        if (!fieldState.$dirty) {
          return null
        }
        return !fieldState.$invalid
      },
      onSubmit(e) {
        const { firstname, lastname } = this.form
        const data = {
          firstname: firstname,
          lastname: lastname,
          username: this.user.username
        }
        this.$store.dispatch(USER_ACCOUNT_REQUEST, data)
          .then((response) => {
            this.showForm = true
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
      },
    },
//    computed: {
//        ...mapState({
//          user: state => state.user.user
//        })
//      }
  }
</script>
