import { USER_REQUEST, USER_ERROR, USER_SUCCESS, USER_LOGOUT } from './mutation-types'
import { AUTH_LOGOUT } from '../auth/mutation-types'
import callApi from '../../Api/mockApi'
import Vue from 'vue'

const state = {
  profile: {},
  status: ''
}

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.name
}

const actions = {
  [USER_REQUEST]: ({commit, dispatch}) => {
    commit(USER_REQUEST)
    callApi({url: 'user/me'})
      .then(resp => {
        commit(USER_SUCCESS, resp)
      })
      .catch(resp => {
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
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success'
    Vue.set(state, 'profile', resp)
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
