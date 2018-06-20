const ChatMessage = require('../../models/chat/message')
const ChatRoom = require('../../models/chat/room')
const roomController = require('./roomController')

module.exports = {
  getOne: function(id, callback) {
    ChatMessage.findById(id, function(err, message){
      if (err) {
        callback(err, null)
        return
      }
      if (!message) {
        callback(null, {
          success: 0,
          message: 'INEXISTANT MESSAGE'
        })
        return
      }
      callback(null, {
        success: 1,
        data: message
      })
    }) 
  },
  getAllByRoom: function(id, callback) {
    roomController.getMessages(id, function(err, messages) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, {
        success: 1,
        data: messages
      })
    })
  }
}
