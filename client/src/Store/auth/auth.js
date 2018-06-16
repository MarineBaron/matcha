import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_ERROR,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  AUTH_PROFILE_REQUEST,
  AUTH_PROFILE_ERROR,
  AUTH_PROFILE_SUCCESS,
} from './mutation-types'
import mockApi from '../../Api/mockApi'
import callApi from '../../Api/callApi'
import Vue from 'vue'

const state = {
  status: '',
  token: localStorage.getItem('user-token') ? localStorage.getItem('user-token') : '',
  profile: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : {},
  hasLoadedOnce: localStorage.getItem('user-token') ? true : false,
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.username
}

const actions = {
  [AUTH_LOGIN_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGIN_REQUEST)
      callApi({url: 'auth/login', data: user, method: 'POST'})
      .then((resp, err) => {
        if (!resp.data.success) {
          reject(err)
        }
        const data = resp.data.data
        localStorage.setItem('user-token', data.token)
        callApi.defaults.headers.common['Authorization'] = data.token
        commit(AUTH_LOGIN_SUCCESS, data.token)
        dispatch(AUTH_PROFILE_REQUEST)
        resolve(resp)
      })
      .catch(err => {
        commit(AUTH_LOGIN_ERROR)
        localStorage.removeItem('user-token')
        reject(err)
      })
    })
  },
  [AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem('user-token')
      localStorage.removeItem('profile')
      resolve()
    })
  },
  [AUTH_PROFILE_REQUEST]: ({commit, dispatch}) => {
    commit(AUTH_PROFILE_REQUEST)
    callApi({url: 'user/profile'})
      .then(resp => {
        const data = resp.data.data
        localStorage.setItem('profile', JSON.stringify(data))
        commit(AUTH_PROFILE_SUCCESS, data)
      })
      .catch(err => {
        commit(AUTH_PROFILE_ERROR)
        dispatch(AUTH_LOGOUT)
      })
  },
}

const mutations = {
  [AUTH_LOGIN_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_LOGIN_SUCCESS]: (state, token) => {
    state.status = 'success'
    Vue.set(state, 'token', token)
    state.hasLoadedOnce = true
  },
  [AUTH_LOGIN_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
  },
  [AUTH_PROFILE_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_PROFILE_SUCCESS]: (state, data) => {
    state.status = 'success'
    Vue.set(state, 'profile', data)
  },
  [AUTH_PROFILE_ERROR]: (state) => {
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
