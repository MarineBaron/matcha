const jwt = require('jsonwebtoken')
const User = require('../models/user')

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
              token: authToken
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


}
