import {
  NOTIFICATION_DELETE_REQUEST,
  NOTIFICATION_DELETE_ERROR,
  NOTIFICATION_DELETE_SUCCESS,
} from './mutation-types'
import {
  AUTH_NOTIFICATION_DELETE,
} from '../auth/mutation-types'
import callApi from '../../Api/callApi'
import Vue from 'vue'

const state = {
  status: '',
}

const getters = {
}

const actions = {
  [NOTIFICATION_DELETE_REQUEST]: ({commit, dispatch}, id) => {
    return new Promise((resolve, reject) => {
      commit(NOTIFICATION_DELETE_REQUEST)
      callApi({url: '/notification/notification/delete/' + id})
      .then((resp) => {
        commit(NOTIFICATION_DELETE_SUCCESS)
        commit(AUTH_NOTIFICATION_DELETE, id)
        resolve(id)
      }, (error) => {
        commit(NOTIFICATION_DELETE_ERROR)
        reject(error)
      })
    })
  },
}

const mutations = {
  [NOTIFICATION_DELETE_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [NOTIFICATION_DELETE_SUCCESS]: (state, id) => {
    state.status = 'success'
  },
  [NOTIFICATION_DELETE_ERROR]: (state) => {
    state.status = 'error'
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
