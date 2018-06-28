const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    name: {
      type: String,
      index: {unique: true}
    }
})

module.exports = mongoose.model('Image', ImageSchema)
