const User = require('../models/user')
const jwt = require('jsonwebtoken')
const mailController = require('./mailController')

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
  create: function (username, email, password, callback) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
          callback(err, null)
          return
      }
      if (user) {
        if (user.confirmed === false) {
          callback(null, {
            success: 0,
            message: 'NOT CONFIRMED'
          })
          return
        }
        callback(null, {
          success: 0,
          message: 'DUPLICATE USERNAME'
        })
        return
      }
      const newUser = new User({
        username: username,
        password: password,
        email: email,
        role: 'user',
        confirmed: false,
        banished: false
      })
      newUser.save(function(err, user) {
        if (err) {
          callback(err, null)
          return
        }
        const authToken = jwt.sign({username: user.username, _id: user._id}, process.env.JWTSECRET)
        const url = process.env.URL_CLIENT + '/confirmation/' + user.username + '/' + authToken
        const text = 'Bonjour,\nVous devez confirmer votre instription en copiant cette url dans votre navigateur: '
          + url + '\nBonne journée !'
        const html = '<p>Bonjour,</p><p>Vous devez confirmer votre instription en cliquant sur le lien suivant : <a href="'
          + url + '">' + url + '</a></p><p>Bonne journée !</p>'
        mailController.send('user', {
          subject: '[Matcha] Confirmation de votre inscription',
          text: text,
          html: html
        })
        callback(null, {
          success: 1,
          token: authToken
        })
      })
    })
  },
}
