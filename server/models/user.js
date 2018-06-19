const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
  }
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

UserSchema.methods.hashPassword = function hashPassword(next) {
  return bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err)
    }
    return bcrypt.hash(this.password, salt, function (hashError, hash) {
      if (hashError) {
        return next(hashError)
      }
      this.password = hash
      return next()
    })
  })
}

module.exports = mongoose.model('User', UserSchema)
