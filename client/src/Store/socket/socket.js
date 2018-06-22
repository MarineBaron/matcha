import { SOCKET_CONNECT, SOCKET_DISCONNECT, SOCKET_ERROR, SOCKET_CHAT_ADDMESSAGE } from './mutation-types'
import { CHAT_ADDMESSAGE } from '../chat/mutation-types'
import Vue from 'vue'

const state = {
  isConnected: false,
  error: ''
}

const actions = {
  [SOCKET_CHAT_ADDMESSAGE]: ({commit, dispatch}, id, message) => {
    console.log('le furet')
  }
}

const mutations = {
  [SOCKET_CONNECT]: (state) => {
    console.log(SOCKET_CONNECT)
    state.isConnected = true
  },
  [SOCKET_DISCONNECT]: (state) => {
    console.log(SOCKET_DISCONNECT)
    state.isConnected = false
  },
  [SOCKET_ERROR]: (state) => {
  },
}

export default {
  state,
  actions,
  mutations
}
