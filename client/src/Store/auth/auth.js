import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_ERROR,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT,
  AUTH_PROFILE_REQUEST,
  AUTH_PROFILE_ERROR,
  AUTH_PROFILE_SUCCESS,
  AUTH_CONFIRM_REQUEST,
  AUTH_CONFIRM_ERROR,
  AUTH_CONFIRM_SUCCESS,
  AUTH_ASK_REQUEST,
  AUTH_ASK_ERROR,
  AUTH_ASK_SUCCESS,
  AUTH_PASSWORD_RESET_REQUEST,
  AUTH_PASSWORD_RESET_ERROR,
  AUTH_PASSWORD_RESET_SUCCESS,

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
          commit(AUTH_LOGIN_ERROR)
          localStorage.removeItem('user-token')
          reject(resp.data.message)
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
      .then((resp) => {
        if (resp.data.success === 0) {
          let message = ''
          switch(resp.message) {
            case 'BAD TOKEN':
              message = 'Votre token est invalide.'
            break;
            case 'BAD USERNAME':
              message = 'Votre token ne correspond pas à votre pseudo.'
            break;
            case 'USER NOT FOUND':
              message = 'Votre pseudo ne correspond à aucun utilisateur enregistré.'
            break;
            default :
              message = 'La confirmation de votre inscription a échoué.'
            break;
          }
          commit(AUTH_CONFIRM_ERROR)
          reject(message)
        } else {
          commit(AUTH_CONFIRM_SUCCESS)
          resolve(resp)
        }
      }, (error) => {
          commit(AUTH_CONFIRM_ERROR)
          reject(message)
      })
      .catch(err => {
        commit(AUTH_CONFIRM_ERROR)
        reject(err)
      })
    })
  },
  [AUTH_ASK_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_ASK_REQUEST)
      callApi({url: 'auth/ask', data, method: 'POST'})
      .then((resp) => {
        if (!resp.data.success) {
          commit(AUTH_ASK_ERROR)
          reject(resp.data.message)
        }
        commit(AUTH_ASK_SUCCESS)
        resolve(resp)
      }, (error) => {
        commit(AUTH_ASK_ERROR)
        reject(error)
      })
      .catch(err => {
        commit(AUTH_ASK_ERROR)
        reject(error)
      })
    })
  },
  [AUTH_PASSWORD_RESET_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_PASSWORD_RESET_REQUEST)
      callApi({url: 'auth/passwordreset', data, method: 'POST'})
      .then((resp) => {
        if (!resp.data.success) {
          commit(AUTH_PASSWORD_RESET_ERROR)
          reject(resp.data.message)
        }
        commit(AUTH_PASSWORD_RESET_SUCCESS)
        resolve(resp)
      }, (error) => {
        commit(AUTH_PASSWORD_RESET_ERROR)
        reject(error)
      })
      .catch(err => {
        commit(AUTH_PASSWORD_RESET_ERROR)
        reject(error)
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
  [AUTH_ASK_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_ASK_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [AUTH_ASK_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_PASSWORD_RESET_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_PASSWORD_RESET_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [AUTH_PASSWORD_RESET_ERROR]: (state) => {
    state.status = 'error'
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
