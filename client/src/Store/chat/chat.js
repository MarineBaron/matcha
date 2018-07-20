import {
  CHAT_OPEN_ROOM_REQUEST,
  CHAT_OPEN_ROOM_ERROR,
  CHAT_OPEN_ROOM_SUCCESS,
  CHAT_SEND_MESSAGE_REQUEST,
  CHAT_SEND_MESSAGE_ERROR,
  CHAT_SEND_MESSAGE_SUCCESS,
  CHAT_CLOSE_ROOM,
  CHAT_CLOSE_ALLROOMS,
  CHAT_ADD_MESSAGE,
  CHAT_TOFRONT_ROOM,
  CHAT_TOGGLE_ROOM,
  CHAT_NEW_MESSAGE,
  CHAT_MORE_REQUEST,
  CHAT_MORE_ERROR,
  CHAT_MORE_SUCCESS,
} from './mutation-types'
import callApi from '../../Api/callApi'
import Vue from 'vue'

const state = {
  status: '',
  rooms: []
}

const getters = {
  getRooms: state => state.rooms,
  getActiveRooms: state => state.rooms.filter(r => r.status === 'actived'),
  getMessagesByRoom: state => roomId => {
    if (!state.rooms || !state.rooms.length) {
      return []
    }
    return state.rooms.find(r => r.data._id === roomId).data.messages
  }
}

const actions = {
  [CHAT_OPEN_ROOM_REQUEST]: ({commit, dispatch}, usernames) => {
    return new Promise((resolve, reject) => {
      commit(CHAT_OPEN_ROOM_REQUEST)
      let room = {}
      if (state.rooms && state.rooms.length && (room = state.rooms.find(r => r.otheruser === usernames[1]))) {
        const data = {
          room: room,
          usernames: usernames
        }
        commit(CHAT_OPEN_ROOM_SUCCESS, data)
        resolve(data)
      } else {
        const data = {
          username1: usernames[0],
          username2: usernames[1],
        }
        callApi({url: 'chat/room', data: data, method: 'POST'})
        .then((resp) => {
          commit(CHAT_OPEN_ROOM_SUCCESS, resp.data.data)
          resolve(resp.data.data)
        }, (error) => {
          commit(CHAT_OPEN_ROOM_ERROR)
          reject(error)
        })
      }
    })
  },
  [CHAT_MORE_REQUEST]: ({commit, dispatch}, room) => {
    return new Promise((resolve, reject) => {
      commit(CHAT_MORE_REQUEST)
      const data = {
        room: room.data._id,
        lastCreated: (room.data.messages && room.data.messages.length)
          ? room.data.messages[0].created
          : null
      }
      callApi({url: 'chat/messages/more', data: data, method: 'POST'})
      .then((resp) => {
        commit(CHAT_MORE_SUCCESS, {
          room: room.data._id,
          messages: resp.data.data
        })
        resolve(resp.data.data)
      }, (error) => {
        commit(CHAT_MORE_ERROR)
        resolve(error)
      })
    })
  },
  [CHAT_SEND_MESSAGE_REQUEST]: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      commit(CHAT_SEND_MESSAGE_REQUEST)
      callApi({url: 'chat/message', data: data, method: 'POST'})
      .then((resp) => {
        resp.data.data.username = data.username
        commit(CHAT_SEND_MESSAGE_SUCCESS, resp.data.data)
        resolve(resp.data.data)
      }, (error) => {
        commit(CHAT_SEND_MESSAGE_ERROR)
        reject(error)
      })
    })
  },
  // [CHAT_CLOSE_ROOM]: ({commit, dispatch}, room) => {
  //   commit(CHAT_CLOSE_ROOM, room.otheruser)
  //   return(room)
  // },
  [CHAT_CLOSE_ALLROOMS]: ({commit, dispatch}) => {
    commit(CHAT_CLOSE_ALLROOMS)
  },
  [CHAT_CLOSE_ROOM]: ({commit, dispatch}, room) => {
    commit(CHAT_CLOSE_ROOM, room)
    return(room)
  },
  [CHAT_CLOSE_ALLROOMS]: ({commit, dispatch}) => {
    commit(CHAT_CLOSE_ALLROOMS)
  },
  [CHAT_ADD_MESSAGE]: ({commit, dispatch}, data) => {
    commit(CHAT_ADD_MESSAGE, data)
  }
}

const mutations = {
  [CHAT_OPEN_ROOM_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [CHAT_OPEN_ROOM_SUCCESS]: (state, data) => {
    state.status = 'success'
    const otheruser = data.usernames[1]
    let room = state.rooms.find(room => room.otheruser === otheruser)
    if (room) {
      room.status = 'actived'
    }
    else {
      state.rooms.push({
        otheruser: otheruser,
        status: 'actived',
        data: data.room,
        new: false
      })
    }
  },
  [CHAT_MORE_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [CHAT_MORE_SUCCESS]: (state, data) => {
    if (data.messages.length) {
      const roomIndex = state.rooms.findIndex(r => r.data._id === data.room)
      if (roomIndex !== -1) {
        data.messages.reverse().forEach(m => {
          state.rooms[roomIndex].data.messages.splice(0, 0, m)
        })
      }
    }
    state.status = 'success'
  },
  [CHAT_MORE_ERROR]: (state) => {
    state.status = 'error'
  },
  [CHAT_OPEN_ROOM_ERROR]: (state) => {
    state.status = 'error'
  },
  [CHAT_SEND_MESSAGE_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [CHAT_SEND_MESSAGE_SUCCESS]: (state, data) => {
    let index = state.rooms.findIndex(r => r.data._id === data.room)
    if (index !== -1) {
      if(!state.rooms[index].data.messages) {
        Vue.set(state.rooms[index].data, 'messages', [])
      }
      Vue.set(state.rooms[index].data.messages, state.rooms[index].data.messages.length, {
        username: data.username,
        message: data.message
      })
    }
    state.status = 'success'
  },
  [CHAT_SEND_MESSAGE_ERROR]: (state) => {
    state.status = 'error'
  },
  [CHAT_CLOSE_ROOM]: (state, room) => {
    console.log(CHAT_CLOSE_ROOM, room)
    state.status = 'success'
    const index = state.rooms.findIndex(r => r.data._id === room.data._id)
    if (index !== -1) {
      state.rooms.splice(index, 1)
    }
  },
  [CHAT_CLOSE_ALLROOMS]: (state) => {
    state.status = 'success'
    Vue.set(state, 'rooms', [])
  },
  [CHAT_ADD_MESSAGE]: (state, data) => {
    state.status = 'success'
    let index = state.rooms.findIndex(r => r.data._id === data.id)
    if (index !== -1) {
      if (!state.rooms[index].data.messages) {
        Vue.set(state.rooms[index].data, 'messages', [])
      }
      Vue.set(state.rooms[index].data.messages, state.rooms[index].data.messages.length, data.message)
    }
  },
  [CHAT_TOFRONT_ROOM]: (state, data) => {
    if (state.rooms.length > 1) {
      const index = state.rooms.findIndex(r => r.data._id === data.data._id)
      if (index !== -1 && index !== state.rooms.length - 1) {
        state.rooms.push(state.rooms[index])
        state.rooms.splice(index, 1)
      }
    }
  },
  [CHAT_TOGGLE_ROOM]: (state, data) => {
    if (state.rooms && state.rooms.length) {
      const index = state.rooms.findIndex(r => r.data._id === data.data._id)
      if (index !== -1) {
        state.rooms[index].status = state.rooms[index].status === 'actived' ? 'closed' : 'actived'
        if (state.rooms[index].status === 'actived') {
          state.rooms[index].new = false
        }
      }
    }
  },
  [CHAT_NEW_MESSAGE]: (state, id) => {
    if (state.rooms && state.rooms.length) {
      const index = state.rooms.findIndex(r => r.data._id === id)
      if (index !== -1) {
        state.rooms[index].new = true
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
