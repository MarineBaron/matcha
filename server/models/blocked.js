const mongoose = require('mongoose')
const User = require('./user.js')

const BlockedSchema = new mongoose.Schema({
  blocker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  blocked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

module.exports = mongoose.model('Blocked', BlockedSchema)
