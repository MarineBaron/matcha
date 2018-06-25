const mongoose = require('mongoose')
const User = require('../user')
const Room = require('./room')

const ChatMessageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  message: String,
  created: {
    type: Date,
    required: true,
    default: new Date()
  },
  updated: {
    type: Date,
    required: true,
    default: new Date()
  },
}, { collection: 'chatmessages' })


module.exports = mongoose.model('ChatMessage', ChatMessageSchema)
