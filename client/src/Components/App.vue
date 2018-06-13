<template>
  <div id="app">
    <header>
      <navigation />
    </header>
    <b-container fluid>
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
    <footer>Footer: {{count}}</footer>
  </div>
</template>

<script>
import Navigation from './Navigation/Navigation.vue'
export default {
  name: 'app',
  components: {
    Navigation
  },
  computed: {
    count() {
      return this.$store.state.count
    }
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

/*
section#content {
  background-color: red;
}
aside {
  background-color: blue;
}
*/
</style>
