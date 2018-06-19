const jwt = require('jsonwebtoken')
const User = require('../models/user')
const userController = require('./userController')

module.exports = {
  login: function(username, password, callback) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0,
          message: 'INEXISTANT LOGIN'
        })
        return
      }
      if (user.confirmed === false) {
        callback(null, {
          success: 0,
          message: 'UNCONFIRMED USER'
        })
        return
      }
      if (user.banished === true) {
        callback(null, {
          success: 0,
          message: 'BANISHED USER'
        })
        return
      }
      user.comparePassword(password, function (err, isMatch) {
        if (err) {
          callback(err, null)
          return
        }
        if (!isMatch) {
          callback(null, {
            success: 0,
            message: 'BAD CREDENTIALS'
          })
          return
        }
        const authToken = jwt.sign({username: user.username, _id: user._id}, process.env.JWTSECRET)
        callback(null, {
          success: 1,
          token: authToken
        })
      })
    })
  },

  logout: function(token) {
  },

  confirm: function(username, token, callback) {
    jwt.verify(token, process.env.JWTSECRET, function(err, decoded) {
      
      if (err) {
        callback(null, {
          success: 0,
          message: 'BAD TOKEN'
        })
        return
      }
      if (decoded.username !== username) {
        callback(null, {
          success: 0,
          message: 'BAD USERNAME'
        })
        return
      }
      User.findOneAndUpdate({username: username}, {confirmed: true}, function(err, user) {
        if (err) {
          callback(err, null)
          return
        }
        if (!user) {
          callback(null, {
            success: 0,
            message: 'USER NOT FOUND'
          })
          return
        }
        callback(null, {
          success: 1
        })
      })
    })
  },
  
  ask: function(type, email, callback) {
    User.findOne({email: email}, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 0,
          message: 'USER NOT FOUND'
        })
        return
      }
      if (user.banished === true) {
        callback(null, {
          success: 0,
          message: 'BANISHED USER'
        })
        return
      }
      if (type === 'confirmation' && user.confirmed) {
        callback(null, {
          success: 0,
          message: 'CONFIRMED USER'
        })
        return
      }
      const authToken = jwt.sign({username: user.username, _id: user._id}, process.env.JWTSECRET)
      switch(type) {
        case 'password':
          userController.sendEmailPasswordReset(user, authToken)
        break;
        case 'username':
          userController.sendEmailAskUsername(user, authToken)
        break
        case 'confirmation':
          userController.sendEmailConfirmation(user, authToken)
        break;
      }
      callback(null, {
        success: 1
      })
    })
  },
  
  passwordreset: function(username, token, password, callback) {
    jwt.verify(token, process.env.JWTSECRET, function(err, decoded) {
      if (err) {
        callback(null, {
          success: 0,
          message: 'BAD TOKEN'
        })
        return
      }
      if (decoded.username !== username) {
        callback(null, {
          success: 0,
          message: 'BAD TOKEN'
        })
        return
      }
      User.findOne({username: username}, function(err, user) {
        if (err) {
          callback(err, null)
          return
        }
        if (!user) {
          callback(null, {
            success: 0,
            message: 'USER NOT FOUND'
          })
          return
        }
        if (user.banished) {
          callback(null, {
            success: 0,
            message: 'BANISHED USER'
          })
          return
        }
        if (!user.confirmed) {
          callback(null, {
            success: 0,
            message: 'UNCONFIRMED USER'
          })
          return
        }
        user.comparePassword(password, function (err, isMatch) {
          if (err) {
            callback(err, null)
            return
          }
          if (isMatch) {
            callback(null, {
              success: 1,
            })
            return
          }
          user.password = password
          user.save(function(err, user) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, {
              success: 1,
            })
          })
        })
      })
    })
  },
}
