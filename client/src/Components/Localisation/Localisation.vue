<template>
  <div>
    <h3>Localisation</h3>
    <div  v-if="bdd">
      <h4>BDD</h4>
      <div>lat: {{bdd.coordinates[1]}}</div>
      <div>lon: {{bdd.coordinates[0]}}</div>
    </div>
    <div v-if="dyn">
      <h4>Dynamique</h4>
      <div>lat: {{dyn.coordinates[1]}}</div>
      <div>lon: {{dyn.coordinates[0]}}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
  import { mapGetters, mapState } from 'vuex'
  import config from '../../Config/config'
  export default {
    data() {
      return {
        options: {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        },
        dyn: null
      }
    },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'getProfile'
    ]),
    user() {
      return this.isAuthenticated ? this.getProfile : null
    },
    bdd() {
      return this.user === null ? null : (!this.user.is_loc ? null : this.user.location)
    },
  },
  mounted() {
    this.getLocalisation()
  },
  methods: {
    successHtml5Localisation(pos) {
      this.dyn = {
        geometry: 'Point',
        coordinates: [pos.coords.longitude, pos.coords.latitude]
      }
    },
    getHtml5Localisation(success, error, options) {
      navigator.geolocation.getCurrentPosition(
        success,
        error,
        options
      )
    },
    successIPLocalisation(pos) {
      this.dyn = {
        geometry: 'Point',
        coordinates: [pos.longitude, pos.latitude]
      }
    },
    errorIPLocalisation(err) {
      console.warn(`ERROR(${err.code}): ${err.type} - ${err.message}`)
    },
    getIPLocalisation(err) {
      axios.get(config.API_IPSTACK_URL, {
        params: {
          access_key: config.API_IPSTACK_KEY,
          fields: 'latitude, longitude',
          output: 'json'
        }
      }).then((resp) => {
        this.successIPLocalisation(resp.data)
      }).catch((err) => {
        this.errorIPLocalisation(resp.error)
      })
    },
    getLocalisation() {
      this.getHtml5Localisation(
        this.successHtml5Localisation,
        this.getIPLocalisation,
        this.options
      )
    }
  }
}
</script>