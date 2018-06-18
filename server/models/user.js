const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Gender = require('./gender.js')
const Hobbie = require('./hobbie.js')
const Preference = require('./preference.js')
const Image = require('./image.js')

const SALT_WORK_FACTOR = 10

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: {unique: true}
  },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'user']
  },
  email: String,
  confirmed: Boolean,
  banished: Boolean,
  created: {
    type: Date,
    required: true,
    default: new Date()
  },
  updated: {
    type: Date,
    required: true,
    default: new Date()
  },
  firstname: String,
  lastname: String,
  age:{ 
      type: Number, 
      min: 18, 
      max: 65 
  },
  resume: String,
  city: String,
  zip: Number,
  tel: [String],
  visibility: {
      type: String,
      enum: ["LoggedOut", "LoggedIn", "Absent", "Buzy" ]
  }, 
  latitude: Number,
  longitude: Number,
  friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }],
  likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }],
  genders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gender'
  }],
  hobbies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hobbie'
  }], 
  preferences: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Preference'
  }], 
  images: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image'
  }]
})

UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback)
}

UserSchema.pre('save', function saveHook(next) {
  const user = this

  if (!user.isModified('password')) {
    return next()
  }
  return bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err)
    }
    return bcrypt.hash(user.password, salt, function (hashError, hash) {
      if (hashError) {
        return next(hashError)
      }
      user.password = hash
      return next()
    })
  })
})

module.exports = mongoose.model('User', UserSchema)
