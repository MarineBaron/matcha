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

      <!-- GASTON 3 : création d'un group radio pour le gender (ajouter plain, sinon cela ne marche pas...) -->
      <b-form-group id="genderGroup"
        label="Genre"
        label-for="gender"
      >
        <b-form-radio-group id="gender"
          v-model="form.gender"
          :options="genderOptions"
          plain
        />
      </b-form-group>

      <!-- GASTON 4 : création d'une list de checkbox pour l'orientation avec les memes options que gender (ajouter plain, sinon cela ne marche pas...)-->
      <b-form-group id="orientationGroup"
        label="Orientation"
        label-for="orientation"
      >
        <b-form-checkbox-group id="orientation"
          v-model="form.orientation"
          :options="genderOptions"
          plain
        />
      </b-form-group>

      <!-- GASTON 5 : création d'une list de checkbox pour les interests (ajouter plain, sinon cela ne marche pas...)-->
      <b-form-group id="interestsGroup"
        label="Centre d'intérêts"
        label-for="interestsn"
      >
        <b-form-checkbox-group id="interests"
          v-model="form.interests"
          :options="interestOptions"
          plain
        />
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
  import callApi from '../../../../Api/callApi'
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

          // GASTON 1 : Ajouter gender, orientation, interests au formulaire
          gender: this.user.gender,
          orientation: this.user.orientation,
          interests: this.user.interests,

          email: this.user.email,
          city: this.user.city,
          zip: this.user.zip,
        },

        // GASTON 2 : Ajouter les options genderOptions & interestOptions que l'on utilisera pour créer les radios et checkbox
        genderOptions: [],
        interestOptions: [],

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
    created: function () {
      // GASTON 8 : Lorsque le formulaire est mounted, on recherche les genders et interestOptions
      callApi({url: '/user/gendersinterests'})
      .then((resp) => {
        // GASTON 9 : modification de la réponse pour que chaque option contienne :
        // (utilisation de Array.map()) {value: objet._id, text: object.name}
        this.genderOptions = resp.data.genders.map(o => {
          return {value: o._id, text: o.name}
        })
        this.interestOptions = resp.data.interests.map(o => {
          return {value: o._id, text: o.name}
        })
      })
      .catch((err) => {
        console.log(err)
      })
    },
    mounted() {
      // GASTON 8 : Lorsque le formulaire est mounted, on recherche les genders et interestOptions
      // GASTON 9 : modification de la réponse (dans le then) pour que chaque option contienne :
      // (utilisation de Array.map()) {value: objet._id, text: object.name}
    },
    methods: {
      statusField(fieldState) {
        if (!fieldState.$dirty) {
          return null
        }
        return !fieldState.$invalid
      },
      onSubmit(e) {
        const {
          firstname,
          lastname,
          // GASTON 6  : ajouter les champs gender, orientation, interests
          gender,
          orientation,
          interests,

          zip,
          city
        } = this.form
        const data = {
          firstname: firstname,
          lastname: lastname,
          username: this.user.username,
          // GASTON 7  : ajouter les champs gender, orientation, interests
          gender,
          orientation,
          interests,
          
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
  }
</script>
