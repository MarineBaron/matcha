import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_ERROR,
  USER_USER_REQUEST,
  USER_USER_ERROR,
  USER_USER_SUCCESS
} from './mutation-types'
import callApi from '../../Api/callApi'
import Vue from 'vue'

const state = {
  status: '',
  user: {},
  users: []
}

const getters = {
  getUser: state => state.user,
  getUsers: state => state.users,
}

const actions = {
  [USER_REGISTER_REQUEST]: ({commit, dispatch}, user) => {
    return new Promise((resolve, reject) => {
      commit(USER_REGISTER_REQUEST)
      callApi({url: 'user/create', data: user, method: 'POST'})
      .then((resp, err) => {
        if (!resp.data.success) {
          reject(err)
        } else {
          commit(USER_REGISTER_SUCCESS)
          resolve(resp)
        }
      })
      .catch(err => {
        commit(USER_REGISTER_ERROR, err)
        reject(err)
      })
    })
  },
  [USER_USER_REQUEST]: ({commit, dispatch}, username) => {
    callApi({url: 'user/user/' + username})
      .then(resp => {
        const data = resp.data.data
        commit(USER_USER_SUCCESS, data)
      })
      .catch(err => {
        commit(USER_USER_ERROR)
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
}

export default {
  state,
  getters,
  actions,
  mutations
}
