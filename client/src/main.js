import config from './Config/config'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import VueFlashMessage from 'vue-flash-message'
import VueSocketio from 'vue-socket.io'
import BootstrapVue from 'bootstrap-vue'
import VueLodash from 'vue-lodash'
import VueMoment from 'vue-moment'


import App from './Components/App.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "vue-flash-message/dist/vue-flash-message.min.css"
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Vuelidate)
Vue.use(VueFlashMessage)
Vue.use(VueMoment)
Vue.component('icon', Icon)

import router from './Router/router'
import store from './Store/store'
Vue.use(VueSocketio, config.SOCKET_URL, store)

new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  store: store
})
