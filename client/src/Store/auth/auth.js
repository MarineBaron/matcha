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
          let message = ''
          switch(resp.data.message) {
            case 'INEXISTANT LOGIN':
              message = 'Ce pseudo est inexistant.'
            break;
            case 'UNCONFIRMED USER':
              message = 'Vous devez confirmer votre inscrption.'
            break;
            case 'BANISHED USER':
              message = 'Vous avez été banni.'
            break;
            case 'BAD CREDENTIALS':
              message = 'Votre pseudo et votre mot de passe ne concordent pas.'
            break;
            default :
              message = 'Vos identifiants sont incorrects.'
            break;
          }
          commit(AUTH_LOGIN_ERROR)
          localStorage.removeItem('user-token')
          reject(message)
        } else {
          const data = resp.data
          localStorage.setItem('user-token', data.token)
          callApi.defaults.headers.common['Authorization'] = data.token
          commit(AUTH_LOGIN_SUCCESS, data.token)
          dispatch(AUTH_PROFILE_REQUEST)
          resolve(resp)
        }
      })
      .catch((err) => {
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
  [AUTH_CONFIRM_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_CONFIRM_REQUEST)
      callApi({url: 'auth/confirm', data, method: 'POST'})
      .then((response) => {

      }, (error) => {

      })
      .catch(err => {

      })
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
  [AUTH_CONFIRM_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_CONFIRM_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [AUTH_CONFIRM_ERROR]: (state) => {
    state.status = 'error'
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
