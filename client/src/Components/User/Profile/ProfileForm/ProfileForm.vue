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
      <b-form-group id="firstnameGroup"
        label="Prénom"
        label-for="firstname"
      >
        <b-form-input id="firstname"
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
      </b-form-group>
      <b-form-group id="lastnameGroup"
        label="Nom"
        label-for="lastname"
      >
        <b-form-input id="lastname"
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
      </b-form-group>

      <b-form-group id="zipGroup"
        label="Code Postal"
        label-for="zip"
      >
        <b-form-input id="zip"
          type="text"
          v-model.trim="form.zip"
          placeholder="Code Postal"
          :state="statusField($v.form.zip)"
          @input="$v.form.zip.$touch(); changeZip()"
        />
        <b-form-invalid-feedback id="zipFeedback">
          Un code postal contient 5 chiffres.
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group id="cityGroup" v-if="displayCitySelect"
        label="Ville"
        label-for="zip"
      >
        <b-form-select id="city"
          v-model="form.city"
          placeholder="Choisissez une ville"
          :state="statusField($v.form.city)"
          :options="citiesOptions"
          @input="$v.form.city.$touch()"
        />
        <b-form-invalid-feedback id="cityFeedback">
          Vous devez choisir une ville
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
  const codesPostaux = require('codes-postaux')
  import { USER_ACCOUNT_REQUEST } from '../../../../Store/user/mutation-types'
  import { validationMixin } from "vuelidate"
  import { required, requiredIf, minLength, maxLength, sameAs, numeric, helpers } from 'vuelidate/lib/validators'
  import { mapState } from 'vuex'

  const zipValidate = helpers.regex('alpha', /^\d{5}$/)

  export default {
    props: ['user'],
    data() {
      return {
        form: {
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          age: this.user.age,
          genders: this.user.genders,
          orientation: this.user.orientation,
          interests: this.user.interests,
          email: this.user.email,
          city: this.user.city,
          zip: this.user.zip,
        },
        citiesOptions: this.user.city ? [this.user.city] : [],
        statusCitiesRequest: '',
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
        zip: {
          zipValidate
        },
        city: {
        }
      }
    },
    methods: {
      statusField(fieldState) {
        if (!fieldState.$dirty) {
          return null
        }
        return !fieldState.$invalid
      },
      mounted: function() {
        this.callApi({url: 'user/users'})
          .then(data => {
            this.genders = data;
          });
       },
      onSubmit(e) {
        const {
          firstname,
          lastname,
          zip,
          city
        } = this.form
        const data = {
          firstname: firstname,
          lastname: lastname,
          username: this.user.username,
          zip,
          city
        }
        console.log('Data send to server',data)

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
      getCitiesApi() {
        this.statusCitiesRequest = 'loading'
        this.citiesOptions = []

        const response = codesPostaux.find(this.form.zip)
        if(response.length) {
          this.citiesOptions = response.map(r => r.nomCommune)
          this.form.city = this.citiesOptions[0]
          this.statusCitiesRequest = 'success'
        } else {
          this.citiesOptions = []
          this.form.city = null
          this.statusCitiesRequest = 'error'
        }
      },
      changeZip(e) {
        if(this.statusField(this.$v.form.zip)) {
          this.getCitiesApi()
        } else {
          this.citiesOptions = []
        }
      }
    },
    computed: {
      displayCitySelect() {
        return this.citiesOptions.length
      }
    }
//    computed: {
//        ...mapState({
//          user: state => state.user.user
//        })
//      }
  }
</script>
