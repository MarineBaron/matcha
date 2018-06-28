const mongoose = require('mongoose')

const GenderSchema = new mongoose.Schema({
    name: {
      type: String,
      index: {unique: true}
    }
})
module.exports = mongoose.model('Gender', GenderSchema)
