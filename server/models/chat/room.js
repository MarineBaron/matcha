const mongoose = require('mongoose')
const User = require('../user')
const ChatMessage = require('./message')

const ChatRoomSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

module.exports = mongoose.model('ChatRoom', ChatRoomSchema)
