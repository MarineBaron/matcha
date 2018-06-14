import { USER_REQUEST, USER_ERROR, USER_SUCCESS, USER_LOGOUT } from './mutation-types'
import { AUTH_LOGOUT } from '../auth/mutation-types'
import callApi from '../../Api/callApi'
import Vue from 'vue'

const state = {
  profile: {},
  status: ''
}

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.username
}

const actions = {
  [USER_REQUEST]: ({commit, dispatch}, username) => {
    commit(USER_REQUEST)
    callApi({url: 'user/profile/' + username})
      .then(resp => {
        const data = resp.data.data
        commit(USER_SUCCESS, data)
      })
      .catch(err => {
        commit(USER_ERROR)
        // if resp is unauthorized, logout, to
        dispatch(AUTH_LOGOUT)
      })
  },
}

const mutations = {
  [USER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, data) => {
    state.status = 'success'
    Vue.set(state, 'profile', data)
  },
  [USER_ERROR]: (state) => {
    state.status = 'error'
    state.profile = {}
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
