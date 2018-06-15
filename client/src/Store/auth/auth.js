import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT, REGISTER_REQUEST, REGISTER_ERROR, REGISTER_SUCCESS } from './mutation-types'
import { USER_REQUEST } from '../user/mutation-types'
import mockApi from '../../Api/mockApi'
import callApi from '../../Api/callApi'
import Vue from 'vue'

const state = {
  status: '',
  token: '',
  hasLoadedOnce: ''
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
}

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      callApi({url: 'auth/login', data: user, method: 'POST'})
      .then((resp, err) => {
        if (!resp.data.success) {
          reject(err)
        }
        const data = resp.data.data
        localStorage.setItem('user-token', data.token)
        commit(AUTH_SUCCESS, data.token)
        dispatch(USER_REQUEST, data.username)
        resolve(resp)
      })
      .catch(err => {
        commit(AUTH_ERROR, err)
        localStorage.removeItem('user-token')
        reject(err)
      })
    })
  },
  [AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem('user-token')
      resolve()
    })
  },
  [REGISTER_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(REGISTER_REQUEST)
      callApi({url: 'auth/register', data: user, method: 'POST'})
      .then(resp => {
        commit(REGISTER_SUCCESS)
        resolve(resp)
      })
      .catch(err => {
        commit(REGISTER_ERROR, err)
        reject(err)
      })
    })
  },
}

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, token) => {
    state.status = 'success'
    Vue.set(state, 'token', token)
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = ''
  },
  [REGISTER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [REGISTER_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [REGISTER_ERROR]: (state) => {
    state.status = 'error'
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
