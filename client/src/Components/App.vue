<template>
  <div id="app">
    <header>
      <navigation />
    </header>
    <b-container fluid>
      <flash-message class="flash-message"></flash-message>
      <b-row>
        <b-col auto>
          <section id="content">
            <router-view />
          </section>
        </b-col>
        <b-col v-if="$route.meta.sidebar" md="4">
          <aside>
            <router-view name="sidebar"/>
          </aside>
        </b-col>
      </b-row>
    </b-container>
    <footer><counter /></footer>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import Navigation from './Navigation/Navigation.vue'
import Counter from './Counter/Counter.vue'
import callApi from '../Api/callApi'

export default {
  name: 'app',
  components: {
    Navigation,
    Counter
  },
  created() {
    this.setAxiosAuthorization()
  },
  methods: {
    setAxiosAuthorization() {
      if (this.token && this.token !== '') {
        callApi.defaults.headers.common['Authorization'] = this.token
      }
    },
  },
  computed: {
    ...mapState({
      token: state => state.auth.token
    })
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.flash-message {
  margin-top: 10px;
}
</style>
