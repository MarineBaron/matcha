import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth/auth'
import user from './user/user'
import chat from './user/user'
import socket from './socket/socket'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    auth,
    chat,
    socket
  },
  strict: debug,
})
