const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const GallerySchema = new mongoose.Schema({
    url: {
      type: String,
      index: {unique: true}
    }
})


module.exports = mongoose.model('Image', GallerySchema)