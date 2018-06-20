const ChatMessage = require('../../models/chat/message')
const ChatRoom = require('../../models/chat/room')

module.exports = {
  getOne: function(id, callback) {
    ChatRoom.findById(id)
      .populate('users')
      .exec(function(err, room) {
        if (err) {
          callback(err, null)
          return
        }
        if (!room) {
          callback(null, {
            success: 0,
            message: 'INEXISTANT MESSAGE'
          })
          return
        }
        callback(null, {
          success: 1,
          data: room
        })
      }) 
  },
  getMessages: function(id, callback) {
    ChatMessage.findById(id)
      .populate('messages')
      .exec(function(err, room)) {
        if (err) {
          callback(err, null)
          return
        }
        if (!room) {
          callback(null, {
            success: 0,
            message: 'INEXISTANT MESSAGE'
          })
          return
        }
        callback(null, {
          success: 1,
          data: room.messages
        })
      }
  }
}
