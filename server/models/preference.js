const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const PrefSchema = new mongoose.Schema({
    name: {
      type: String,
      index: {unique: true}
    }
})


// module.exports = mongoose.model('User', PrefSchema)