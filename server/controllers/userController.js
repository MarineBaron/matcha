const async = require('async')
const jwt = require('jsonwebtoken')
const lodash = require('lodash')
const axios = require('axios')

const User = require('../models/user')
// GASTON 12 : Ajouter les modèles exigés
// à toi de jouer
const Gender = require('../models/gender')
const Interest = require('../models/interest')

const Like = require('../models/likes')
const Image = require('../models/image')
const mailController = require('./mailController')

function searchLocation(updateUser, user, callback) {
  if (updateUser.zip !== user.zip
      || updateUser.city !== user.city
      || (updateUser.zip !== '' && user.is_loc !== true)
    )
  {
    const params = {
      country: 'France',
      postalcode: updateUser.zip,
      format: 'json',
    }
    if(updateUser.city) {
      params.city = updateUser.city
    }
    axios.get(process.env.API_OPENSTREETMAP_SEARCH, {
      params
    })
    .then((resp) => {
      updateUser.location = {
        type: 'Point',
        coordinates: [parseFloat(resp.data[0].lon), parseFloat(resp.data[0].lat)]
      }
      updateUser.is_loc = true
      callback(null, updateUser)
      return

    })
    .catch((err) => {
      callback(err, null)
      return
    })
  } else {
    callback(null, updateUser)
  }
}

function nbInterests(iA, iB) {
  let nb = 0
  iA.forEach(ui => {
    iB.forEach(i => {
      console.log(ui, i)
      if (ui.toString() == i) {
        nb++
      }
    })
  })
  return nb
}

function userCalcMatching(userA, user) {

  userA.communInterests = nbInterests(userA.interests, user.interests)
  userA.distance = userA.dist.calculated
  const factDist = userA.distance < 10 ? 5 : (userA.distance < 50 ? 3 : (userA.distance < 500 ? 1 : 0))
  userA.matching = factDist + 2 * userA.communInterests
}

function usersCalcMatching(users, user) {
  return new Promise((resolve, reject) => {
    return Promise.all(users.map((u) => userCalcMatching(u, user)))
    .then(() => {resolve(users)})
    .catch((err) => reject(err))
  })
}

function updateScore(user, callback) {
  console.log('updateScore', user)
  async.parallel({
    likes: (callback) => {
      user.getLikes(user._id, callback)
    },
    likers: (callback) => {
      user.getLikers(user._id, callback)
    },
  }, function(err, results) {
    if (err) {
      callback(err, null)
      return
    }
    const friends = lodash.intersectionBy(results.likes, results.likers, 'username')
    const likes = lodash.differenceBy(results.likes, friends, 'username')
    const likers = lodash.differenceBy(results.likers, friends, 'username')
    const score = friends.length * 2 + likers.length
    User.findByIdAndUpdate(user._id, {score: score}, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
    })
    callback(null, score)
    return
  })
}


module.exports = {
  findAll: function(callback){
    User.find(function(err, users) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, {
        success: 1,
        data: users
      })
    })
  },
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
          delete user.password
          callback(null, {
            success: 1,
            data: user
        })
      }
    })
  },
  findCompleteByUsername: function(username, callback) {
    User.findOne({username: username})
      .select('_id username visited firstname lastname age resume city zip visibility avatar gallery gender orientation interests last_logout location is_loc score')
      .populate({
        path: 'avatar.image'
      })
      .populate({
        path: 'gallery.image'
      })
      .populate('gender')
      .populate('orientation')
      .populate('interests')
      .exec(function (err, user) {
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
        async.parallel({
          likes: (callback) => {
            user.getLikes(user._id, callback)
          },
          likers: (callback) => {
            user.getLikers(user._id, callback)
          },
        }, function(err, results) {
          if (err) {
            callback(err, null)
            return
          }
          const friends = lodash.intersectionBy(results.likes, results.likers, 'username')
          const likes = lodash.differenceBy(results.likes, friends, 'username')
          const likers = lodash.differenceBy(results.likers, friends, 'username')
          const data = {
            _id: user._id,
            username: user.username,
            visited: user.visited,
            firstname: user.firstname,
            lastname: user.lastname,
            age: user.age,
            resume: user.resume,
            city: user.city,
            zip: user.zip,
            visibility: user.visibility,
            gender: user.gender,
            orientation: user.orientation,
            interests: user.interests,
            likes: likes ? likes : [],
            likers: likers ? likers : [],
            friends: friends ? friends : [],
            last_logout: user.last_logout,
            location: user.location,
            score: user.score
          }
          callback(null, {
            success: 1,
            data: data
          })
        })
      })
  },



  findFriendsByUsername: function(username, callback){
    User.findOne({username: username})
      .exec(function (err, user) {
        if (err){
          callback(err, null)
          return
        }
        if (!user){
          callback(null, {
            success: 0
          })
        } else {
          async.parallel({
            likes: (callback) => {
              user.getLikes(user._id, callback)
            },
            likers: (callback) => {
              user.getLikers(user._id, callback)
            },
          }, function(err, results) {
            if (err) {
              callback(err, null)
              return
            }
            const friends = lodash.intersectionBy(results.likes, results.likers, 'username')
            callback(null, {
              success: 1,
              data: friends ? friends : []
            })
          })
        }
      })

  },



  create: function (username, email, password, callback) {
    const self = this
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
        self.sendEmailConfirmation(user, authToken)
        callback(null, {
          success: 1,
          token: authToken
        })
      })
    })
  },

  // GASTON 11 : ceation d'une méthode getGendersInterests
  // cette méthode utilise async.parallel pour rechercher les 2 infos
  getGendersInterests: function(callback) {
    // on fait les 2 requetes en parallele
    async.parallel({
      // cette requete renvoie les genders, si pas d'erreur
      genders: (callback) => {
        Gender.find({}, function(err, results) {
          if (err){
            callback(err, null)
            return
          }
          callback(null, results)
        })
      },
      // cette requete renvoie les interests, si pas d'erreur
      interests: (callback) => {
        Interest.find({}, function(err, results) {
          if (err){
            callback(err, null)
            return
          }
          callback(null, results)
        })
      }
      // lorsque les 2 requetes ont été exécutées, on peut retourner le résultat final
    }, function(err, results) {
      if (err){
        callback(err, null)
        return
      }
      callback(null, results)
    })
  },

  update: function (updateUser, callback){
    User.findOne({username: updateUser.username}, function(err, user) {
      if (err){
        callback(err, null)
        return
      }
      searchLocation(updateUser, user, function(err, updateUser) {
        if (err){
          callback(err, null)
          return
        }
        updateScore(user, function(err, score) {
          if (err){
            callback(err, null)
            return
          }
          console.log(updateUser)
          User.findOneAndUpdate({username: updateUser.username}, updateUser, {new: true}, function(err, newUser) {
            if (err){
              callback(err, null)
              return
            }
            callback(null, {
              success: 1,
              data: newUser
            })
          })
        })
      })
    })
  },

  updateRelation: function (data, callback) {
    async.parallel({
      // on recherche les 2 users
      actor: (callback) => User.getItemByUsername(data.actor, callback),
      receptor: (callback) => User.getItemByUsername(data.receptor, callback),
    }, function (err, results) {
      if (err){
        callback(err, null)
        return
      }
      const users = {
        liker: results.actor._id,
        liked: results.receptor._id
      }
      data.actor = results.actor
      data.receptor = results.receptor
      switch(data.action) {
        case 'like':
          // on recherche si la paire existe
          Like.findOne(users, function(err, result) {
            if (err){
              callback(err, null)
              return
            }
            // La paire existe, on renvoie un message
            if (result) {
              callback(null, {
                success: 0,
                message: 'ALREADY LIKED'
              })
              return
            }
            // On cree la paire
            const like = new Like(users)
            like.save(function(err, result) {
              if (err){
                callback(err, null)
                return
              }
              // On recherche la paire inverse
              Like.findOne({
                liker: results.receptor._id,
                liked: results.actor._id
              }, function(err, result) {
                if (err){
                  callback(err, null)
                  return
                }
                // La paire inverse existe (=> relike)
                if (result) {
                  data.action = 'relike'
                }
                async.parallel({
                  actor: (callback) => {
                    updateScore(data.actor, callback)
                  },
                  receptor: (callback) => {
                    updateScore(data.receptor, callback)
                  }
                }, function(err, results) {
                  if (err){
                    callback(err, null)
                    return
                  }
                  data.scores = results
                  callback(null, {
                    success: 1,
                    data: data
                  })
                  return
                })
              })
            })
          })
        break
        case 'unlike':
          Like.findOne(users, function(err, result) {
            if (err){
              callback(err, null)
              return
            }
            if (!result) {
              callback(null, {
                success: 0,
                message: 'NOT LIKED'
              })
              return
            }
            Like.deleteOne(users, function(err, result) {
              if (err){
                callback(err, null)
                return
              }
              async.parallel({
                actor: (callback) => {
                  updateScore(data.actor, callback)
                },
                receptor: (callback) => {
                  updateScore(data.receptor, callback)
                }
              }, function(err, results) {
                if (err){
                  callback(err, null)
                  return
                }
                data.scores = results
                callback(null, {
                  success: 1,
                  data: data
                })
                return
              })
            })
          })
        break
      }
    })
  },

  addVisit: function(username, callback) {
    User.findOneAndUpdate({username: username}, {$inc: {visited: 1}}, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, {
        success: 1
      })
    })
  },

  findMatch: function(username, callback) {
    User.findOne({username: username}, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      User.aggregate([
        {
         $geoNear: {
            near: { type: "Point", coordinates: user.location.coordinates },
            distanceField: "dist.calculated",
            query: {
              username: {$ne: user.username},
              is_completed: true,
              is_loc: true,
              gender: {$in: user.orientation},
            },
            distanceMultiplier: 1.0/6378.1,
            spherical: true
          }
        }
      ]).exec(function(err, users) {
        if (err) {
          callback(err, null)
          return
        }

        usersCalcMatching(users, user)
        .then((resp) => {

          callback(null, {
            success: 1,
            data: resp.sort((a, b) => b.matching - a.matching).slice(0, 9)
          })
        })
        .catch((err) => {
          callback(err, null)
        })
      })
    })
  },



  sendEmailConfirmation: function(user, authToken) {
    const url = encodeURI(process.env.URL_CLIENT + '/confirmation/' + user.username + '/' + authToken)
    const text = 'Bonjour,\nVous devez confirmer votre inscription en copiant cette url dans votre navigateur: '
      + url + '\nBonne journée !'
    const html = '<p>Bonjour,</p><p>Vous devez confirmer votre inscription en cliquant sur le lien suivant : <a href="'
      + url + '">' + url + '</a></p><p>Bonne journée !</p>'
    mailController.send('user', {
      subject: '[Matcha][' + user.username + '] Confirmation de votre inscription',
      text: text,
      html: html
    })
  },
  sendEmailPasswordReset: function(user, authToken) {
    const url = encodeURI(process.env.URL_CLIENT + '/passwordreset/' + user.username + '/' + authToken)
    const text = 'Bonjour,\nVous pourrez modifier votre mot de passe en copiant cette url dans votre navigateur: '
      + url + '\nBonne journée !'
    const html = '<p>Bonjour,</p><p>Vous pourrez modifier votre mot de passe en cliquant sur le lien suivant : <a href="'
      + url + '">' + url + '</a></p><p>Bonne journée !</p>'
    mailController.send('user', {
      subject: '[Matcha][' + user.username + '] Modification de votre mot de passe',
      text: text,
      html: html
    })
  },
  sendEmailAskUsername: function(user) {
    const text = 'Bonjour,\nLe pseudo associé à votre adresse email est : ' + user.username
      + '\nBonne journée !'
    const html = '<p>Bonjour,</p><p>Le pseudo associé à votre adresse email est : ' + user.username
      + '</p><p>Bonne journée !</p>'
    mailController.send('user', {
      subject: '[Matcha][' + user.username + '] Demande de pseudo',
      text: text,
      html: html
    })
  },
}
