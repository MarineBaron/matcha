import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_ERROR,
  USER_USER_REQUEST,
  USER_USER_ERROR,
  USER_USER_SUCCESS,
  USER_USERS_REQUEST,
  USER_USERS_ERROR,
  USER_USERS_SUCCESS
} from './mutation-types'
import callApi from '../../Api/callApi'
import Vue from 'vue'

const state = {
  status: '',
  user: {},
  users: []
}

const getters = {
  // getUser: state => state.user,
  // getUsers: state => state.users,
}

const actions = {
  [USER_REGISTER_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(USER_REGISTER_REQUEST)
      callApi({url: 'user/create', data: user, method: 'POST'})
      .then((resp, err) => {
        if (!resp.data.success) {
          commit(USER_REGISTER_ERROR)
          reject(resp.data.message)
        } else {
          commit(USER_REGISTER_SUCCESS)
          resolve(resp)
        }
      })
      .catch(err => {
        commit(USER_REGISTER_ERROR)
        reject(err)
      })
    })
  },
  [USER_USER_REQUEST]: ({commit, dispatch}, username) => {
    return new Promise((resolve, reject) => {
      commit(USER_USER_REQUEST)
      callApi({url: 'user/user/' + username})
      .then((resp, err) => {
        if (!resp.data.success) {
          commit(USER_USER_ERROR)
          reject(resp.data.message)
        } else {
          console.log('action USER_USER_REQUEST',resp.data)
          commit(USER_USER_SUCCESS)
          resolve(resp.data.data)
        }
      })
      .catch(err => {
        commit(USER_USER_ERROR)
        reject(err)
      })
    })
  },
  [USER_USERS_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(USER_USERS_REQUEST)
      callApi({url: 'user/users'})
      .then((resp, err) => {
        if (!resp.data.success) {
          commit(USER_USERS_ERROR)
          reject(resp.data.message)
        } else {
          commit(USER_USERS_SUCCESS, resp.data.data)
          resolve(resp.data.data)
        }
      })
      .catch(err => {
        commit(USER_USERS_ERROR)
        reject(err)
      })
    })
  }
}

const mutations = {
  [USER_REGISTER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_REGISTER_SUCCESS]: (state) => {
    state.status = 'success'
  },
  [USER_REGISTER_ERROR]: (state) => {
    state.status = 'error'
  },
  [USER_USER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_USER_SUCCESS]: (state, data) => {
    state.status = 'success',
    state.user = data
  },
  [USER_USER_ERROR]: (state) => {
    state.status = 'error',
    state.user = {}
  },
  [USER_USERS_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_USERS_SUCCESS]: (state, data) => {
    state.status = 'success'
    state.users = data
  },
  [USER_USERS_ERROR]: (state) => {
    state.status = 'error',
    state.users = []
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
