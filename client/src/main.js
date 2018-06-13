import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import BootstrapVue from "bootstrap-vue"
import App from './Components/App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Vuelidate)

import router from './Router/router'
import store from './Store/store'

new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  store: store
})
