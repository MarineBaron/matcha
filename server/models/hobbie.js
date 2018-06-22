const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const HobbiSchema = new mongoose.Schema({
    name: {
      type: String,
      index: {unique: true}
    }
})
 module.exports = mongoose.model('Image', HobbiSchema)