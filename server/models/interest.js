const mongoose = require('mongoose')

const InterestSchema = new mongoose.Schema({
    name: {
      type: String,
      index: {unique: true}
    }
})
 module.exports = mongoose.model('Interest', InterestSchema)
