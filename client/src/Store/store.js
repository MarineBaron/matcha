import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth/auth'
import user from './user/user'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    auth,
  },
  strict: debug,
})
