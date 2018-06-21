import {
  CHAT_OPENROOM_REQUEST,
  CHAT_OPENROOM_ERROR,
  CHAT_OPENROOM_SUCCESS,
  CHAT_OPENROOM_SOCKET,
  CHAT_CLOSEROOM
} from './mutation-types'
import callApi from '../../Api/callApi'
import Vue from 'vue'

const state = {
  status: '',
  rooms: []
}

const getters = {
  getActiveRooms: state => state.rooms
  // getActiveRooms: state => {
  //   //console.log(state.rooms)
  //   return
  //   //!state.rooms ? {} : Object.keys(state.rooms).filter(key => state.rooms[key].status === 'actived')
  //   state.rooms
  // }
}

const actions = {
  [CHAT_OPENROOM_REQUEST]: ({commit, dispatch}, usernames) => {
    return new Promise((resolve, reject) => {
      commit(CHAT_OPENROOM_REQUEST)
      let room = {}
      if (this.rooms && (room = this.rooms.find(room => room.otheruser === usernames[1]))) {
        commit(CHAT_OPENROOM_SUCCESS, usernames[1])
        //dispatch(CHAT_OPENROOM_SOCKET, room)
        resolve(room)
      } else {
        const data = {
          username1: usernames[0],
          username2: usernames[1],
        }
        callApi({url: 'chat/room', data: data, method: 'POST'})
        .then((resp) =>{
          commit(CHAT_OPENROOM_SUCCESS, resp.data.data)
          //dispatch(CHAT_OPENROOM_SOCKET, resp.room)
          resolve(resp.data.data)
        }, (error) => {
          commit(CHAT_OPENROOM_ERROR)
          reject(error)
        })
      }
    })
  },
  [CHAT_OPENROOM_SOCKET]: ({commit, dispatch}, usernames) => {
    console.log('CHAT_OPENROOM_SOCKET')
  },
  [CHAT_CLOSEROOM]: ({commit, dispatch}, room) => {
    commit(CHAT_CLOSEROOM, room.otheruser)
    return(room._id)
  }
}

const mutations = {
  [CHAT_OPENROOM_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [CHAT_OPENROOM_SUCCESS]: (state, data) => {
    state.status = 'success'
    const otheruser = data.usernames[1]
    const rooms = state.rooms.filter(room => room.otheruser === otheruser)
    if (rooms.length) {
      rooms[0].status = 'actived'
      rooms[0].data = data.room
    }
    else {
      state.rooms.push({
        otheruser: otheruser,
        status: 'actived',
        data: data.room
      })
    }
  },
  [CHAT_OPENROOM_ERROR]: (state) => {
    state.status = 'error'
  },
  [CHAT_CLOSEROOM]: (state, otheruser) => {
    state.rooms.splice(state.rooms.findIndex(room => room.otheruser === otheruser), 1)
    state.status = 'success'
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
