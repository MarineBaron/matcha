const async = require('async')
const jwt = require('jsonwebtoken')
const lodash = require('lodash')
const axios = require('axios')
const fs = require('fs')

const User = require('../models/user')
// GASTON 12 : Ajouter les modèles exigés
const Gender = require('../models/gender')
const Interest = require('../models/interest')

const Like = require('../models/likes')
const Block = require('../models/blocked')
const Image = require('../models/image')
const mailController = require('./mailController')

function getAltFromFilename(filename) {
  return filename
}

function moveFile(user, file) {
  return new Promise((resolve, reject) => {
    Image.findOne({name: file.originalname}, function(err, image) {
      if(err) {
        reject(err)
        return
      }
      if (image) {
        fs.unlink(file.path, function(err) {
          if(err) {
            reject(err)
            return
          }
          let newImage = {
            image: image,
            alt: getAltFromFilename(file.originalname)
          }
          let gallery = user.gallery ? user.gallery : []
          gallery.push(newImage)
          newImage = gallery[gallery.length - 1]
          User.findByIdAndUpdate(user._id, {
            gallery: gallery
          }, function (err, user) {
            if(err) {
              reject(err)
              return
            }
            resolve(newImage)
          })
        })
      } else {
        fs.rename(file.path, 'public/images/' + file.originalname, function(err) {
          if(err) {
            reject(err)
            return
          }
          const newImage = new Image({
            name: file.originalname
          })
          newImage.save(function(err, image) {
            if(err) {
              reject(err)
              return
            }
            let newImage = {
              image: image,
              alt: getAltFromFilename(file.originalname)
            }
            let gallery = user.gallery ? user.gallery : []
            gallery.push(newImage)
            newImage = gallery[gallery.length - 1]
            User.findByIdAndUpdate(user._id, {
              gallery: gallery
            }, function (err, user) {
              if(err) {
                reject(err)
                return
              }
              resolve(newImage)
            })
          })
        })
      }
    })
  })
}

function moveFiles(user, files) {
  return new Promise((resolve, reject) => {
    return Promise.all(files.map((file) => moveFile(user, file)))
    .then((results) => {resolve(results)})
    .catch((err) => reject(err))
  })
}

function updateIsCompleted(user, callback) {
  let maxCompleted = 0
  let completed = 0
  // avatar
  maxCompleted++
  if (user.avatar.image) {
    completed++
  }
  // gender
  maxCompleted++
  if (user.gender) {
    completed++
  }
  // age (field Number)
  maxCompleted++
  if (user.age) {
    completed++
  }
  // champs Text ou Array
  const fields = [
    'firstname',
    'lastname',
    'resume',
    'zip',
    'orientation',
    'interests',
    'gallery'
  ]
  maxCompleted += fields.length
  fields.forEach(f => {
    if (user[f].length) {
      completed++
    }
  })
  const is_completed = completed === maxCompleted ? true : false
  User.findByIdAndUpdate(user._id, {is_completed}, {new: true}, function(err, newUser) {
    if(err) {
      callback(err, null)
      return
    }
    callback(null, newUser)
    return
  })
}

function searchLocation(updateUser, user, callback) {
  // suppression de ctte partie, car la localisation des users n'est pas associée à leur ville
  callback(null, updateUser)
  // if (updateUser.zip !== user.zip
  //     || updateUser.city !== user.city
  //     || (updateUser.zip !== '' && user.is_loc !== true)
  //   )
  // {
  //   const params = {
  //     country: 'France',
  //     postalcode: updateUser.zip,
  //     format: 'json',
  //   }
  //   if(updateUser.city) {
  //     params.city = updateUser.city
  //   }
  //   axios.get(process.env.API_OPENSTREETMAP_SEARCH, {
  //     params
  //   })
  //   .then((resp) => {
  //     updateUser.location = {
  //       type: 'Point',
  //       coordinates: [parseFloat(resp.data[0].lon), parseFloat(resp.data[0].lat)]
  //     }
  //     updateUser.is_loc = true
  //     callback(null, updateUser)
  //     return
  //
  //   })
  //   .catch((err) => {
  //     callback(err, null)
  //     return
  //   })
  // } else {
  //   callback(null, updateUser)
  // }
}

function updateScore(user, callback) {
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
  findGenders: function(callback){
    Gender.find(function(err, genders) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, {
        success: 1,
        data: genders
      })
    })
  },
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
  findUsers: function(nbByPage, page, callback){
    User.find({
      confirmed: true,
      //banished: false
    }, 'username avatar last_logout is_loc location')
    .populate('avatar.image')
    .sort({
      created: -1
    })
    .skip(parseInt(nbByPage) * parseInt(page))
    .limit(parseInt(nbByPage))
    .exec(function(err, users) {
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
          blockers: (callback) => {
            user.getBlockers(user._id, callback)
          },
          blocked: (callback) => {
            user.getBlocked(user._id, callback)
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
            avatar: user.avatar,
            gallery: user.gallery,
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
            blockers: results.blockers ? results.blockers : [],
            blocked: results.blocked ? results.blocked : [],
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
          User.findOneAndUpdate({username: updateUser.username}, updateUser, {new: true}, function(err, newUser) {
            if (err){
              callback(err, null)
              return
            }
            updateIsCompleted(newUser, function(err, newUser) {
              if (err){
                callback(err, null)
                return
              }
              User.findById(user._id, '_id firstname lastname age gender orientation interests zip city is_completed')
              .populate('gender')
              .populate('orientation')
              .populate('interests')
              .exec(function(err, user) {
                if (err){
                  callback(err, null)
                  return
                }
                callback(null, {
                  success: 1,
                  data: user
                })
              })
            })
          })
        })
      })
    })
  },

  uploadFiles: function(username, files, callback) {
    // recherche du user
    User.findOne({username: username}, '_id gallery avatar', function(err, user) {
      if (err){
        callback(err, null)
        return
      }
      if (!user) {
        callback(err, null)
        return
      }
      moveFiles(user, files)
      .then((results) => {
        // si le user a déjà un Avatar
        if (user.avatar.image) {
          callback(null, {
            success: 1,
            data: {
              imgs: results
            }
          })
          return
        }
        if (!results.length) {
          callback(null, {
            success: 1,
            data: {
              imgs: results
            }
          })
          return
        }
        // si le user n'a pas d'avatar, on lui met le premier des files
        User.findByIdAndUpdate(user._id, {
          avatar: {
            image: results[0].image._id,
            alt: results[0].alt,
          }
        }, {new: true})
        .populate('avatar.image')
        .exec(function (err, newUser) {
          if (err){
            callback(err, null)
            return
          }
          callback(null, {
            success: 1,
            data: {
              imgs: results,
              avatar: newUser.avatar
            }
          })
        })
      })
      .catch((err) => {
        callback(err, null)
      })
    })
  },

  chooseAvatar: function(username, id, callback) {
    User.findOne({username: username}, '_id gallery', function(err, user) {
      if (err){
        callback(err, null)
        return
      }
      if (!user) {
        callback(err, null)
        return
      }
      const image = user.gallery.id(id)
      if(!image) {
        callback(err, null)
        return
      }
      User.findByIdAndUpdate(user._id, {
        avatar: {
          image: image.image._id,
          alt: image.alt
        }
      }, {new: true})
      .populate('avatar.image')
      .exec(function(err, newUser) {
        if (err){
          callback(err, null)
          return
        }
        callback(null, {
          success: 1,
          avatar: newUser.avatar
        })
      })
    })
  },

  deleteImage: function(username, id, callback) {
    // on recherche le user
    User.findOne({username: username}, '_id gallery avatar')
    .populate('gallery.image')
    .exec(function(err, user) {
      if (err){
        callback(err, null)
        return
      }
      if (!user) {
        callback(err, null)
        return
      }
      // on recherche si le user possède bien cette image
      const index = user.gallery.findIndex(i => i.image._id.toString() === id.toString())
      if(index === -1) {
        callback(err, null)
        return
      }
      // on supprime l'image de la gallery
      const idGallery = user.gallery[index]._id
      const idImage = user.gallery[index].image._id
      user.gallery.splice(index, 1)
      let data = {
        gallery: user.gallery
      }
      let dataToSend = {
        id: idGallery
      }
      if (user.avatar.image && idImage.toString() === user.avatar.image.toString()) {
        let avatar = {}
        if(user.gallery.length) {
          avatar = user.gallery[0]
        }
        data.avatar = avatar
        dataToSend.avatar = avatar
      }
      User.findByIdAndUpdate(user._id, data, function(err, user) {
        if (err){
          callback(err, null)
          return
        }
        callback(null, {
          success: 1,
          data: dataToSend
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
      const users = data.action === 'like' || data.action === 'unlike'
      ? {
        liker: results.actor._id,
        liked: results.receptor._id
      }
      : {
        blocker: results.actor._id,
        blocked: results.receptor._id
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
        case 'block':
        Block.findOne(users, function (err, block) {
          if(err) {
            callback(err, null)
            return
          }
          if(block) {
            callback(null, {
              success: 0,
              message: 'ALLREADY BLOCKED'
            })
            return
          }
          // on cherche si le receptor était liké pour le déliker
          Like.findOne({
            liker: results.actor._id,
            liked: results.receptor._id
          }, function(err, like) {
            if(err) {
              callback(err, null)
              return
            }
            // il était liké
            if(like) {
              Like.deleteOne({
                liker: results.actor._id,
                liked: results.receptor._id,
              }, function(err) {
                const block = new Block(users)
                block.save(function(err, result) {
                  if(err) {
                    callback(err, null)
                    return
                  }
                  // on met à jour les score
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
                    // on change le nom de l'action
                    data.action = 'blockunlike'
                    data.scores = results
                    // on renvoie le résultat (avec les nouveaux scores)
                    callback(null, {
                      success: 1,
                      data: data
                    })
                    return
                  })
                })
              })
            } else {
              // il n'était pas liké
              const block = new Block(users)
              block.save(function(err, result) {
                if(err) {
                  callback(err, null)
                  return
                }
                // on renvoie le résultat
                callback(null, {
                  success: 1,
                  data: data
                })
                return
              })
            }
          })
        })

        break
        case 'unblock':
          Block.findOne(users, function (err, block) {
            if(err) {
              callback(err, null)
              return
            }
            if (!block) {
              callback(null, {
                success: 0,
                message: 'NOT BLOCKED'
              })
              return
            }
            Block.deleteOne(users, function(err) {
              if(err) {
                callback(err, null)
                return
              }
              // on renvoie le résultat
              callback(null, {
                success: 1,
                data: data
              })
              return
            })
          })
        break
      }
    })
  },

  updateLocation: function(body, callback) {
    User.findOneAndUpdate({username: body.username}, {
      is_loc: true,
      location: body.location
    }, function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, {
        success: 1
      })
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

  getInfos: function(username, callback) {
    async.parallel({
      genders: (callback) => {
        Gender.find({}, function(err, results) {
          if (err){
            callback(err, null)
            return
          }
          callback(null, results)
        })
      },
      interests: (callback) => {
        Interest.find({}, function(err, results) {
          if (err){
            callback(err, null)
            return
          }
          callback(null, results)
        })
      },
      agemax: (callback) => {
        User.aggregate([
          {$match: {
            is_completed: true,
            is_loc: true,
          }},
          {$sort: {'age': -1}},
          {$limit: 1},
          {$project: {_id: 0, value: '$age'}}
        ]).exec(function(err, results) {
          if (err){
            callback(err, null)
            return
          }
          callback(null, results[0].value)
        })
      },
      agemin: (callback) => {
        User.aggregate([
          {$match: {
            is_completed: true,
            is_loc: true,
          }},
          {$sort: {'age': 1}},
          {$limit: 1},
          {$project: {_id: 0, value: '$age'}}
        ]).exec(function(err, results) {
          if (err){
            callback(err, null)
            return
          }
          callback(null, results[0].value)
        })
      },
      distances: (callback) => {
        User.findOne({username: username}, function(err, user) {
          if (err){
            callback(err, null)
            return
          }
          let query = {
            username: {$ne: user.username},
            is_completed: true,
            is_loc: true,
          }
          User.aggregate([
            {
             $geoNear: {
                near: { type: "Point", coordinates: user.location.coordinates },
                distanceField: "dist.calculated",
                query: query,
                distanceMultiplier: 0.001,
                spherical: true,
              }
            }
          ]).exec(function(err, users) {
            if (err) {
              callback(err, null)
              return
            }
            if (!users.length) {
              callback(null, [0,0])
              return
            }
            callback(null, [
              Math.floor(users[0].dist.calculated),
              Math.ceil(users[users.length - 1].dist.calculated)
            ])
          })
        })
      },
      scoremax: (callback) => {
        User.aggregate([
          {$match: {
            is_completed: true,
            is_loc: true,
          }},
          {$sort: {'score': -1}},
          {$limit: 1},
          {$project: {_id: 0, value: '$score'}}
        ]).exec(function(err, results) {
          if (err){
            callback(err, null)
            return
          }
          callback(null, results[0].value)
        })
      },
      scoremin: (callback) => {
        User.aggregate([
          {$match: {
            is_completed: true,
            is_loc: true,
          }},
          {$sort: {'score': 1}},
          {$limit: 1},
          {$project: {_id: 0, value: '$score'}}
        ]).exec(function(err, results) {
          if (err){
            callback(err, null)
            return
          }
          callback(null, results[0].value)
        })
      }
    }, function(err, results) {
      if (err){
        callback(err, null)
        return
      }
      callback(null, {
        genders: results.genders,
        interests: results.interests,
        ages: [results.agemin, results.agemax],
        distances: results.distances,
        scores: [results.scoremin, results.scoremax]
      })
    })
  },

  findMatch: function(body, callback) {
    async.parallel({
      user: (callback) => User.findOne({username: body.username}, '_id username orientation location is_loc interests', callback),
      interests: (callback) => Interest.find({_id: {$in: body.interests}}, '_id', callback),
      genders: (callback) => Gender.find({_id: {$in: body.genders}}, '_id', callback),
    }, function(err, results) {
      if (err) {
        callback(err, null)
        return
      }
      if (!results.user.is_loc) {
        callback(null, {
          success: 1,
          users: [],
          total: 0
        })
        return
      }

      Block.find({blocker: results.user._id}, 'blocked')
      .exec(function(err, blocked) {
        const blockedUsers = blocked.map(b => b.blocked)
        const interests = results.interests.map(i => i._id)
        const genders = body.type === 'match'
          ? results.user.orientation
          : results.genders.map(i => i._id)

        if(!interests || !interests.length || !genders || !genders.length) {
          callback(null, {
            success: 1,
            users: [],
            total: 0
          })
          return
        }

        let query = {
          _id: {$nin: blockedUsers},
          username: {$ne: results.user.username},
          is_completed: true,
          is_loc: true,
          gender: {$in: genders},
          interests: {$elemMatch: {$in: interests}},
          age: {
            $gte: body.ages[0],
            $lte: body.ages[1]
          },
          score: {
            $gte: body.scores[0],
            $lte: body.scores[1]
          }
        }
        User.aggregate([
          {
           $geoNear: {
              near: { type: "Point", coordinates: results.user.location.coordinates },
              distanceField: "dist.calculated",
              query: query,
              minDistance: parseFloat(body.distances[0]) * 1000,
              maxDistance: parseFloat(body.distances[1]) * 1000,
              distanceMultiplier: 0.001,
              spherical: true
            }
          },
          {
            $lookup: {
              from: 'genders',
              localField: 'gender',
              foreignField: '_id',
              as: 'gender'
            }
          },
          {
            $lookup: {
              from: 'images',
              localField: 'avatar.image',
              foreignField: '_id',
              as: 'avatar.image'
            }
          },
          {
            $project: {
              _id: 1,
              username: 1,
              avatar: 1,
              score: 1,
              age: 1,
              city: 1,
              location: 1,
              is_loc: 1,
              bot: 1,
              distance: {$trunc: "$dist.calculated"},
              interests: 1,
              matchInterests: {
                $sum : {
                  $map: {
                    input: "$interests",
                    as: "i",
                    in: {$cond: [{$in : ["$$i" , results.user.interests]}, 1, 0]}
                  }
                }
              },
              gender: "$gender.name",
            }
          },
          {
            $addFields: {
              matching: {
                $add: [{
                  $multiply: [5, "$matchInterests"]
                }, {
                  $cond: [{$lte : ["$distance" , 5]}, 5, {
                    $cond: [{$lte : ["$distance" , 10]}, 4, {
                      $cond: [{$lte : ["$distance" , 50]}, 3, {
                        $cond: [{$lte : ["$distance" , 100]}, 2, {
                          $cond: [{$lte : ["$distance" , 500]}, 1, 0]
                        }]
                      }]
                    }]
                  }]
                }
              ]},
            }
          },
          {
            $lookup: {
              from: 'interests',
              localField: 'interests',
              foreignField: '_id',
              as: 'interests'
            }
          },
          { $unwind: "$gender" },
          { $unwind: "$avatar.image" },
          { $sort: body.sortOrder },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              results: { $push: '$$ROOT' }
            }
          },
          {
            $project: {
              count: 1,
              rows: { $slice: ['$results', (body.currentPage - 1) * body.perPage, (body.currentPage) * body.perPage] }
          }
        }
      ]).then((resp) => {
        if (!resp.length) {
          callback(null, {
            success: 1,
            users: [],
            total: 0
          })
          return
        }
        const [{count, rows}] = resp
          callback(null, {
            success: 1,
            users: rows,
            total: count
          })
          return
        }).catch((err) => {
          callback(err, null)
          return
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
