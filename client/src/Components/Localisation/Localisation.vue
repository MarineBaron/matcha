<template>
</template>

<script>
  import axios from 'axios'
  import callApi from '../../Api/callApi'
  import { mapGetters, mapState } from 'vuex'
  import config from '../../Config/config'
  import { AUTH_CHANGE_LOCATION } from '../../Store/auth/mutation-types'
  import { USER_CHANGE_LOCATION } from '../../Store/user/mutation-types'
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
    dyn (n, o) {
      if(this.isAuthenticated &&  this.user.username && n !== null) {
        //console.log('change dyn')
        this.updateLocalisation()
      }
    },
    user(n, o) {
      if(this.isAuthenticated &&  this.user.username && this.dyn !== null) {
        //console.log('change dyn')
        this.updateLocalisation()
      }
    }
  },
  mounted() {
    if (config.MODE === 'dev') {
      this.getDevLocalisation()
    } else {
      this.getLocalisation()
    }
  },
  methods: {
    updateLocalisation() {
      if (this.bdd === null
        || this.bdd.coordinates[0] !== this.dyn.coordinates[0]
        || this.bdd.coordinates[1] !== this.dyn.coordinates[1]
      ) {
        const data = {
          username: this.user.username,
          location: this.dyn
        }
        callApi({url: '/user/updatelocation', data , method: 'POST'})
        .then((resp) => {
          //console.log('CHANGE_LOCATION', data)
          this.$socket.emit('CHANGE_LOCATION', data)
          this.$store.commit(AUTH_CHANGE_LOCATION, data)
        })
        .catch((err) => {
          console.log('updateLocalisation Error', err)
        })
      }
    },
    // méthode pour créer des coordonnées aléatoires en mode dev
    getDevLocalisation() {
      const latMax = 51.0686
      const latMin = 41.3133
      const lonMax = 9.5599
      const lonMin = -5.1511

      this.dyn = {
        type: 'Point',
        coordinates: [
          Math.random() * (lonMax - lonMin) + lonMin,
          Math.random() * (latMax - latMin) + latMin,
        ]
      }
    },
    successHtml5Localisation(pos) {
      this.dyn = {
        type: 'Point',
        coordinates: this.calcCoordinates([pos.coords.longitude, pos.coords.latitude])
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
        coordinates: this.calcCoordinates([pos.longitude, pos.latitude])
      }
    },
    errorIPLocalisation(err) {
      console.warn(`ERROR(${err.code}): ${err.type} - ${err.message}`)
      this.dyn = this.bdd
    },
    getIPLocalisation(err) {
      axios.get(config.API_IPSTACK_URL, {
        headers: {
          'Access-Control-Allow-Origin': 'http://api.ipstack.com',
          'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin',
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
  },
  sockets: {
    CHANGE_LOCATION: function(data) {
      //console.log(AUTH_CHANGE_LOCATION, data)
      this.$store.commit(AUTH_CHANGE_LOCATION, data)
    }
  }
}
</script>