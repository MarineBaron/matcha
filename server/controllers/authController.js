const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

module.exports = {
  login: function(username, password, callback) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(err, null)
      } else {
        user.comparePassword(password, function (err, isMatch) {
          if (err) {
            callback(err, null)
            return
          }
          if (isMatch) {
            const authToken = jwt.sign({username: user.username, _id: user._id}, process.env.JWTSECRET)
            callback(null, {
              token: authToken,
              username: user.username,
              role: user.role,
            })
          } else {
            callback(err, null)
          }
        })
      }
    })
  },
  
  logout: function(token) {
  },
  
  register: function (username, password, callback) {
    console.log(username, password)
    const newUser = new User({
      username: username, 
      password: password, 
      role: 'user'
    })
    console.log(newUser)
    newUser.save(function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      const authToken = jwt.sign({username: user.username, _id: user._id}, process.env.JWTSECRET)
      callback(null, authToken)
    })
  },
}
