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
  import callApi from '../../Api/callApi'
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
  watch: {
    dyn(n, o) {
      if(this.user && n !== o && n) {
        if (this.bdd === null
          || this.bdd.coordinates[0] !== n.coordinates[0]
          || this.bdd.coordinates[1] !== n.coordinates[1]
        ) {
          const data = {
            username: this.user.username,
            location: n
          }
          callApi({url: '/user/updatelocation', data , method: 'POST'})
          .then((resp) => {
            console.log('Localisation Success', resp)
          })
          .catch((err) => {
            console.log('Localisation Error', err)
          })
        }
      }
    }
  },
  mounted() {
    this.getLocalisation()
  },
  methods: {
    successHtml5Localisation(pos) {
      this.dyn = {
        type: 'Point',
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
        type: 'Point',
        coordinates: [pos.longitude, pos.latitude]
      }
    },
    errorIPLocalisation(err) {
      console.warn(`ERROR(${err.code}): ${err.type} - ${err.message}`)
      this.dyn = this.bdd
    },
    getIPLocalisation(err) {
      axios.get(config.API_IPSTACK_URL, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
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