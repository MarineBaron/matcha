const mongoose = require('mongoose')
const User = require('../user')

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  message: String,
  read: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    required: true,
    default: new Date()
  },
}, { collection: 'notifications' })


module.exports = mongoose.model('Notification', NotificationSchema)
