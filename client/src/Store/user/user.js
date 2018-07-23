import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_ERROR,
  USER_USER_REQUEST,
  USER_FRIENDS_REQUEST,
  USER_FRIENDS_ERROR,
  USER_FRIENDS_SUCCESS,
  USER_USER_ERROR,
  USER_USER_SUCCESS,
  USER_USERS_REQUEST,
  USER_USERS_ERROR,
  USER_USERS_SUCCESS,
  USER_ACCOUNT_REQUEST,
  USER_ACCOUNT_SUCCESS,
  USER_ACCOUNT_ERROR,
  USER_CHANGE_LOCATION,
  USER_ACCOUNT_ADDIMG,
  USER_ACCOUNT_REMIMG,
  USER_ACCOUNT_CHANGEAVATAR,
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
      .then((resp) => {
        if (!resp.data.success) {
          commit(USER_USER_ERROR)
          reject(resp.data.message)
        } else {
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
      .then((resp) => {
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
  },

  [USER_FRIENDS_REQUEST]: ({commit, dispatch}, username) => {
    return new Promise((resolve, reject) => {
      commit(USER_FRIENDS_REQUEST)
      callApi({url: 'user/friends/' + username})
      .then((resp, err) => {
        if (!resp.data.success) {
          commit(USER_FRIENDS_ERROR)
          reject(resp.data.message)
        } else {
          console.log(USER_FRIENDS_REQUEST, resp)
          commit(USER_FRIENDS_SUCCESS, resp.data.data)
          resolve(resp.data.data)
        }
      })
      .catch(err => {
        commit(USER_FRIENDS_ERROR)
        reject(err)
      })
    })
  },

  [USER_ACCOUNT_REQUEST]: ({commit, dispatch}, user) => {
    console.log('store/user/user.js callApi')
    return new Promise((resolve, reject) => {
      commit(USER_ACCOUNT_REQUEST)
      callApi({url: 'user/update', data: user, method: 'POST'})
      .then((resp) => {
        if (!resp.data.success) {
          commit(USER_ACCOUNT_ERROR)
          reject(resp.data.message)
        } else {
          commit(USER_ACCOUNT_SUCCESS, resp.data.data)
          resolve(resp)
        }
      }, (err) => {
        commit(USER_ACCOUNT_ERROR)
        reject(err)
      })
    })
  },

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
    state.status = 'success'
    if (data) {
      Vue.set(state, 'user', {
        username: data.username,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        age: data.age,
        resume: data.resume,
        city: data.city,
        zip: data.zip,
        visibility: data.visibility,
        gender: data.gender,
        orientation: data.orientation,
        interests: data.interests,
        avatar: data.avatar,
        gallery: data.gallery,
        location: data.location,
        is_loc: data.is_loc,
        score: data.score
      })
    }
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
  [USER_FRIENDS_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_FRIENDS_SUCCESS]: (state, data) => {
    state.status = 'success'
    state.users = data
  },
  [USER_FRIENDS_ERROR]: (state) => {
    state.status = 'error',
    state.users = []
  },
  [USER_ACCOUNT_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_ACCOUNT_SUCCESS]: (state, data) => {
    state.status = 'success'
    if(data) {
      Vue.set(state, 'user', Object.assign(state.user, {
        firstname: data.firstname,
        lastname: data.lastname,
        age: data.age,
        gender: data.gender,
        orientation: data.orientation,
        interests: data.interests,
        zip: data.zip,
        city: data.city
      }))
    }

  },
  [USER_ACCOUNT_ERROR]: (state) => {
    state.status = 'error'
  },
  [USER_CHANGE_LOCATION]: (state, data) => {
    if (data.username === state.user.username) {
      state.user.is_loc = true
      state.user.location = data.location
    }
  },
  [USER_ACCOUNT_ADDIMG]: (state, data) => {
    if(data.imgs && data.imgs.length) {
      data.imgs.map(d => {
        state.user.gallery.splice(state.user.gallery.length, 0, d)
      })
    }
    if (data.avatar) {
      state.user.avatar = data.avatar
    }
  },
  [USER_ACCOUNT_REMIMG]: (state, data) => {
    const index = state.user.gallery.findIndex(i => i._id === data.id)
    if(index !== -1) {
      state.user.gallery.splice(index, 1)
    }
    if (data.avatar) {
      state.user.avatar = data.avatar
    }
  },
  [USER_ACCOUNT_CHANGEAVATAR]: (state, avatar) => {
    state.user.avatar = avatar
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
