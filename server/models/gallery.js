const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    url: {
      type: String,
      index: {unique: true}
    }
})