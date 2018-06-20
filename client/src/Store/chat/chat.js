import {
  CHAT_OPENROOM_REQUEST,
  CHAT_OPENROOM_ERROR,
  CHAT_OPENROOM_SUCCESS,
} from './mutation-types'
import callApi from '../../Api/callApi'
import Vue from 'vue'

const state = {
  status: '',
  rooms: {}
}

const getters = {
}

const actions = {
  [CHAT_OPENROOM_REQUEST]: ({commit, dispatch}, usernames) => {
    return new Promise((resolve, reject) => {
      commit(CHAT_OPENROOM_REQUEST)
      if (this.rooms[usernames[1]]) {
        commit(CHAT_OPENROOM_SUCCESS, usernames[1])
        resolve(this.rooms[usernames[1]])
      } else {
        const data = {
          username1: usernames[0],
          username2: usernames[1],
        }
        callApi({url: 'chat/room', data: data, method: 'POST'})
        .then((resp) =>{
          commit(CHAT_OPENROOM_SUCCESS)
          resolve(resp.data.data)
        }, (error) => {
          commit(CHAT_OPENROOM_ERROR)
          reject(error)
        })
        .catch(err => {
          commit(CHAT_OPENROOM_ERROR)
          reject(err)
        })
      }
    })
  }
}

const mutations = {
  [CHAT_OPENROOM_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [CHAT_OPENROOM_SUCCESS]: (state, username) => {
    state.status = 'success'
    if (rooms[username]) {
      rooms[username].status = 'actived'
    } else {
      rooms[username] = {
        status: 'actived'
      }
    }
  },
  [CHAT_OPENROOM_ERROR]: (state) => {
    state.status = 'error'
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
