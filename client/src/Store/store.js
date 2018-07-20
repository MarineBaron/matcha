import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth/auth'
import user from './user/user'
import chat from './chat/chat'
import map from './map/map'
import notification from './notification/notification'
import socket from './socket/socket'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    auth,
    chat,
    notification,
    socket
  },
  strict: debug,
})
