const mongoose = require('mongoose')
const User = require('./user')

const LikeSchema = new mongoose.Schema({
  liker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  liked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
})

module.exports = mongoose.model('Like', LikeSchema)
