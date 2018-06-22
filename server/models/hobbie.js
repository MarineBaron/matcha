const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const HobbySchema = new mongoose.Schema({
    name: {
      type: String,
      index: {unique: true}
    }
}, {collection: 'hobbies'})
 module.exports = mongoose.model('Hobby', HobbySchema)