const User = require('../models/user')
const jwt = require('jsonwebtoken')

module.exports = {
  findById: function(id, callback) {
    User.findById(id, function (err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0
        })
      } else {
          callback(null, {
            success: 1,
            data: {
              username: user.username,
              role: user.role,
            }
        })
      }
    })
  },
  findByUsername: function(username, callback) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0
        })
      } else {
          callback(null, {
            success: 1,
            data: {
              username: user.username,
              role: user.role,
            }
        })
      }
    })
  },
  create: function (username, password, callback) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
          callback(err, null)
          return
      }
      if (user) {
        callback(null, {
          success: false
        })
        return
      }
      const newUser = new User({
        username: username,
        password: password,
        role: 'user'
      })
      newUser.save(function(err, user) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, {
          success: true,
          token: jwt.sign({username: user.username, _id: user._id}, process.env.JWTSECRET)
        })
      })
    })
  },
}
