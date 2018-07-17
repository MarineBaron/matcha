const async = require('async')
const jwt = require('jsonwebtoken')
const lodash = require('lodash')
const loremIpsum = require('lorem-ipsum')
const printf = require('printf')
const fs = require('fs')
const axios = require('axios')
const countLinesInFile = require('count-lines-in-file')
const nthline = require('nthline')
const path = require('path')

const User = require('../../models/user')
const Image = require('../../models/image')
const Gender = require('../../models/gender')
const Interest = require('../../models/interest')
const Like = require('../../models/likes')
const ChatRoom = require('../../models/chat/room')
const notifController = require('./../notification/notificationController')
const roomController = require('./../chat/roomController')
const messageController = require('./../chat/messageController')
const userController = require('./../userController')

const citiesFile = path.resolve(__dirname, '../../' + process.env.CITIES_FILE)


function getLineCount(file, cb) {
    let count = 0;

    fs.createReadStream(file)
      .on('data', function(chunk) {
        for (let i = 0; i < chunk.length; i++)
        if (chunk[i] == 10) count++;
      })
      .once('error', cb('error'))
      .on('end', function() {
        cb(null, count);
      });
}

function getLocalisation(nbLines) {
  return new Promise((resolve, reject) => {
    const numLine = Math.floor(Math.random() * nbLines)
    nthline(numLine, citiesFile)
    .then(line => {
      axios.get(process.env.API_GOUV_REQUEST_COMMUNES + line, {
        params: {
          fields: 'nom,codesPostaux,centre',
          format: 'json',
          geometry: 'centre'
        }
      })
      .then((resp) => {
        const loc = {
          zip: resp.data.codesPostaux[Math.floor(Math.random() * resp.data.codesPostaux.length)],
          city: resp.data.nom,
          coordinates:resp.data.centre.coordinates
        }
        console.log('loc', loc)
        resolve(loc)
      })
      .catch((err) => resolve(null))
    })
    .catch(err => reject(err))
  })
}

function getLocalisations(nbUsers, nbLines) {
  return new Promise((resolve, reject) => {
    let tab = []
    for (i = 0; i < nbUsers; i++) {
      tab.push(i)
    }
    return Promise.all(tab.map((i) => getLocalisation(nbLines)))
    .then((results) => {resolve(results.filter(r => r !== null))})
    .catch((err) => reject(err))
  })
}

function getLocalisationAll(nbUsers, callback) {
  countLinesInFile(citiesFile, (error, nbLines) => {
   if(error) {
     callback(error, null)
   }
   getLocalisations(nbUsers, nbLines)
   .then((results) => {callback(null, results)})
   .catch(err => {callback(err, null)})
  })
}

function getAleaIndexes(size, min, max, exact) {
  return new Promise((resolve, reject) => {
    let nb = 0
    if (exact !== undefined && exact !== null) {
      nb = exact
    } else {
      nb = Math.floor(Math.random() * size)
      if(min !== undefined && min !== null) {
        nb = Math.max(min, nb)
      }
      if(max !== undefined && max !== null) {
        nb = Math.min(max, nb)
      }
    }
    let tab = []
    let result = []
    let alea
    let i = 0
    while (i < size) {
      tab.push(i)
      i++
    }
    i = 0
    while (i < nb && tab.length) {
      alea = Math.floor(Math.random() * tab.length)
      result.push(tab[alea])
      tab.splice(alea, 1)
      i++
    }
    resolve(result)
  })
}

function getAleaObject(obj) {
  return new Promise((resolve, reject) => {
    resolve(obj)
  })
}


function getAleaObjects(tab) {
  return new Promise((resolve, reject) => {
    getAleaIndexes(tab.length, 1)
    .then((indexes) => {
      if(!indexes.length) {
        resolve([])
        return
      }
      return Promise.all(indexes.map((i) => getAleaObject(tab[i])))
      .then((results) => {resolve(results)})
      .catch((err) => reject(err))
    })
  })
}

function getAleaName() {
  name = loremIpsum({
    count: 1,
    units: 'words',
    format: 'plain',
    random: Math.random
  })
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function createImage(files, i) {
  return new Promise((resolve, reject) => {
    Image.findOne({name: files[i]}, '_id name', function(err, image) {
      if (err) {
        reject(err)
      }
      if (image) {
        resolve({
          image: {
            _id: image._id
          },
          alt: 'alt: ' + image.name
        })
        return
      }
      image = new Image({
        name: files[i]
      })
      image.save()
      .then((image) => {
        resolve({
          image: {
            _id: image._id
          },
          alt: 'alt: ' + image.name
        })
      })
      .catch(err => {
        reject(err)
      })
    })
  })
}


function getAleaFiles(files) {
  return new Promise((resolve, reject) => {
    const nb = Math.floor(Math.random() * 4) + 1
    getAleaIndexes(files.length, null, null, nb)
    .then(indexes => {
      if(!indexes.length) {
        resolve([])
        return
      }
      return Promise.all(indexes.map(i => createImage(files, i)))
      .then(results => {
        resolve(results)
      })
      .catch((err) => reject(err))
    })
  })
}

function createUser(i, params) {
  return new Promise((resolve, reject) => {
    const newUser = new User({
      bot: true,
      username: 'bot' + i,
      email: 'email' + i + '@email.fr',
      password: params.password,
      confirmed: Math.random() > params.nonConfirmed
    })
    newUser.save()
    .then(() => resolve())
    .catch((err) => {reject(err)})
  })
}

function createUsers(nbUsers, params) {
  return new Promise((resolve, reject) => {
    let tab = []
    for (i = 0; i < nbUsers; i++) {
      tab.push(i)
    }
    return Promise.all(tab.map((i) => createUser(i, params)))
    .then(() => {resolve()})
    .catch((err) => reject(err))
  })
}

function updateUser(results, params, user) {
  return new Promise((resolve, reject) => {
    getAleaFiles(results.files)
    .then((gallery) => {
      getAleaObjects(results.genders)
      .then((orientation) => {
        getAleaObjects(results.interests)
        .then((interests) => {
          let updateUser = {
            firstname: getAleaName(),
            lastname: getAleaName(),
          }
          if (Math.random() > params.nonCompleted) {
            const loc = results.cities[Math.floor(Math.random() * results.cities.length)]
            const location = {
              type: 'Point',
              coordinates: loc.coordinates
            }
            updateUser = Object.assign({
              is_loc: true,
              is_completed: true,
              firstname: getAleaName(),
              lastname: getAleaName(),
              is_completed: true,
              age: Math.floor(Math.random() * (params.maxAge - params.minAge)) + params.minAge,
              resume: loremIpsum({
                count: 3,
                units: 'paragraphs',
                format: 'plain',
                random: Math.random
              }),
              city: loc.city,
              zip: loc.zip,
              location: location,
              gender: results.genders[Math.floor(Math.random() * results.genders.length)]._id,
              orientation: orientation,
              interests: interests,
              gallery: gallery,
              avatar: gallery[Math.floor(Math.random() * gallery.length)]
            }, updateUser)
          }
          User.update({_id: user._id}, updateUser, function(err) {
            if (err) {
              reject(err)
            }
            resolve()
          })
        })
        .catch((err) => reject(err))
      })
      .catch((err) => reject(err))
    })
    .catch((err) => reject(err))
  })
}

function updateUsers(results, params) {
  return new Promise((resolve, reject) =>  {
    return Promise.all(results.users.map(u => updateUser(results, params, u)))
    .then(() => resolve())
    .catch((err) => reject(err))
  })
}

function createMessage(results) {
  return new Promise((resolve, reject) =>  {
    const message = {
      username: Math.random() < 0.5 ? results.user.username : results.otherUser.username,
      roomId: results.room._id,
      message: loremIpsum({
        count: 1,
        units: 'sentences',
        format: 'plain',
        random: Math.random
      })
    }
    messageController.create(message, function(err, result) {
      if (err) {
        reject(err)
      }
      // notification associée
      const notification = {
        username: message.username === results.user.username ? results.otherUser.username : results.user.username,
        type: 'chat',
        room: results.room._id,
        origin: message.username === results.user.username ? results.user.username : results.otherUser.username,
        message: ' vous a envoyé un message.'
      }
      notifController.create(notification, function(err, notification) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  })
}

function createMessages(results, params) {
  return new Promise((resolve, reject) =>  {
    const nbm = Math.floor(Math.random() * params.nbMessages)
    if (!nbm) {
      resolve()
      return
    }
    let messages = []
    for(j = 0; j < nbm; j++) {
      messages.push(i)
    }
    return Promise.all(messages.map(i => createMessage(results, params)))
    .then(() => resolve())
    .catch((err) => reject(err))
  })
}

function createChat(isFriend, params, user, otherUser) {
  return new Promise((resolve, reject) => {
    if(!isFriend) {
      resolve()
      return
    }
    if(Math.random() > params.nbChats) {
      resolve()
      return
    }
    ChatRoom.findOne({users: user._id}, '_id')
    .where('users', otherUser._id)
    .exec(function(err, room) {
      if (err) {
        reject(err)
        return
      }
      if (room) {
        resolve()
        return
      }
      room = new ChatRoom({
        users: [user._id, otherUser._id]
      })
      room.save()
      .then((room) => {
        // création des messages
        createMessages({
          room,
          user,
          otherUser
        }, params)
        .then(() => resolve())
        .catch((err) => {reject(err)})
      })
      .catch((err) => {reject(err)})
    })
  })
}

function createLiked(otherUsers, params, user, i) {
  return new Promise((resolve, reject) => {
    const otherUser = otherUsers[i]
    const like = new Like({
      liker: user._id,
      liked: otherUser._id
    })
    like.save()
    .then((like) => {
      // si je suis déjà liké
      Like.findOne({
        liker: otherUser._id,
        liked: user._id
      }, function (err, like) {
        if (err) {
          reject(err)
          return
        }
        const isFriend = like ? true : false
        // creation d'un chat
        createChat(isFriend, params, user, otherUser)
        .then(() => {
          // envoi d'une notification
          const notification = {
            username: otherUser.username,
            type: 'relation',
            origin: user.username,
            message: isFriend ? ' vous a reliké, vous êtes amis.' : ' vous a liké.'
          }
          notifController.create(notification, function(err, notification) {
            if (err) {
              reject(err)
              return
            }
            resolve()
          })
        })
        .catch(err => {reject(err)})
      })
    })
    .catch(err => {reject(err)})
  })
}

function createLikeds(otherUsers, params, user, indexes) {
  return new Promise((resolve, reject) => {
    return Promise.all(indexes.map(i => createLiked(otherUsers, params, user, i)))
    .then(() => resolve())
    .catch((err) => reject(err))
  })
}

function createVisit(visitor, user) {
  return new Promise((resolve, reject) => {
    userController.addVisit(user.username, function(err, result) {
      if(err) {
        reject(err)
        return
      }
      const notification = {
        username: user.username,
        type: 'visit',
        origin: visitor ? visitor.username : null,
        message: (visitor === null ? 'Un visiteur anonyme' : '') + ' a visité votre profil.'
      }
      notifController.create(notification, function(err, notification) {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  })
}

function createVisits(otherUsers, params, user) {
  return new Promise((resolve, reject) => {
    const nbo = otherUsers.length
    const nbv = Math.floor(Math.random() * params.maxVisits)
    if(!nbv) {
      resolve()
    }
    let visitors = []
    let i = 0
    while(i < nbv) {
      if (Math.random() < params.anonymVisit) {
        visitors.push(null)
      } else {
        visitors.push(otherUsers[Math.floor(Math.random() * nbo)])
      }
      i++
    }
    return Promise.all(visitors.map(visitor => createVisit(visitor, user)))
    .then(() => resolve())
    .catch((err) => reject(err))
  })
}

function createRelationsUser(allUsers, params, user) {
  return new Promise((resolve, reject) =>  {
    const otherUsers = allUsers.filter(u => {return u._id !== user._id && u.username !== 'admin'})
    if(!otherUsers.length) {
      resolve()
      return
    }
    createVisits(otherUsers, params, user)
    .then(() => {
      getAleaIndexes(otherUsers.length, null, null, Math.floor(Math.random() * params.nbUsers * params.maxLikes))
      .then((indexes) => {
        if(!indexes.length) {
          resolve()
          return
        }
        createLikeds(otherUsers, params, user, indexes)
        .then(() => {resolve()})
        .catch((err) => reject(err))
      })
    })
    .catch(err => {reject(err)})
  })
}

function createRelationsUsers(allUsers, params) {
  return new Promise((resolve, reject) =>  {
    return Promise.all(allUsers.filter(u => {return u.bot === true}).map(u => createRelationsUser(allUsers, params, u)))
    .then(() => resolve())
    .catch((err) => reject(err))
  })
}

function updateScore(user) {
  return new Promise((resolve, reject) =>  {
    async.parallel({
      likes: (callback) => {
        user.getLikes(user._id, callback)
      },
      likers: (callback) => {
        user.getLikers(user._id, callback)
      },
    }, function(err, results) {
      if (err) {
        reject(err)
        return
      }
      const friends = lodash.intersectionBy(results.likes, results.likers, 'username')
      const likes = lodash.differenceBy(results.likes, friends, 'username')
      const likers = lodash.differenceBy(results.likers, friends, 'username')
      const score = friends.length * 2 + likers.length
      User.findByIdAndUpdate(user._id, {score: score}, function(err, user) {
        if (err) {
          reject(err)
          return
        }
      })
      resolve(score)
      return
    })
  })
}

function updateScoreUsers() {
  return new Promise((resolve, reject) => {
    User.find({}, function(err, users) {
      if (err) {
        reject(err)
        return
      }
      return Promise.all(users.map(u => updateScore(u)))
      .then(() => {
        resolve()
        return
      })
      .catch((err) => {
        reject(err)
        return
      })
    })
  })
}


function deleteUser(user) {
  return new Promise((resolve, reject) =>  {
    async.parallel({
      notifications: (callback) => {
        notifController.deleteAllByUser(user.username, callback)
      },
      chat: (callback) => {
        roomController.deleteAllByUser(user._id, callback)
      },
      likes: (callback) => {
        Like.deleteMany({liker: user._id}, callback)
      },
      likers: (callback) => {
        Like.deleteMany({liked: user._id}, callback)
      }
    }, function(err, results) {
        if (err) {
          reject(err)
          return
        }
        // User
        User.deleteOne({_id: user._id}, function(err) {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
    })
  })
}

function deleteUsers(users) {
  return new Promise((resolve, reject) =>  {
    return Promise.all(users.map(user => deleteUser(user)))
    .then(() => resolve())
    .catch((err) => reject(err))
  })
}

module.exports = {
  findAll: function(data, callback) {
    const options = {}
    if (data.filters.confirmed !== null) {
      options.confirmed = data.filters.confirmed
    }
    if (data.filters.is_completed !== null) {
      options.is_completed = data.filters.is_completed
    }
    if (data.filters.bot !== null) {
      options.bot = data.filters.bot
    }
    let queryUsers = User.find(options, '_id username avatar confirmed is_completed bot location is_loc last_logout score')
    let queryTotal = User.count(options)
    queryUsers
    .populate({
      path: 'avatar.image'
    })
    .sort((data.sortDesc ? '-' : '') + data.sortBy)
    .skip(data.perPage * (data.currentPage - 1))
    .limit(data.perPage)

    async.parallel({
      users: (callback) => {
        queryUsers.exec(callback)
      },
      total: (callback) => {
        queryTotal.exec(callback)
      }
    }, function(err, results) {
      if(err) {
        callback(err, null)
        return
      }
      callback(null, {
        success: 1,
        data: results.users,
        total: results.total
      })
    })
  },
  deleteOne: function(username, callback) {
    User.findOne({username: username}, '_id username', function(err, user) {
      if (err) {
        callback(err, null)
        return
      }
      if (!user) {
        callback(null, {
          success: 1
        })
        return
      }
      deleteUser(user)
      .then(() => {
        updateScoreUsers()
        .then(() => {
          callback(null, {
            success: 1
          })
          return
        })
        .catch(err => {
          callback(err, null)
          return
        })
      })
      .catch(err => callback(err, null))
    })
  },
  deleteBots: function(callback){
    User.find({bot: 1}, '_id' , function(err, users) {
      if (err) {
        callback(err, null)
        return
      }
      deleteUsers(users)
      .then(() => {
        updateScoreUsers()
        .then(() => {
          callback(null, {
            success: 1
          })
          return
        })
        .catch(err => {
          callback(err, null)
          return
        })
      })
      .catch(err => {
        callback(err, null)
        return
      })
    })
  },
  createBots: function(callback){
      const nbUsers = 10
      const nonConfirmed = 0.1
      const banished = 0.1
      const nonCompleted = 0.2
      const maxLikes = 0.5
      const maxFriends = 0.5
      const nbChats = 0.5
      const nbMessages = 15
      const minAge = 18
      const maxAge = 250
      const minImage = 1
      const maxImage = 5
      const maxVisits = 15
      const anonymVisit = 0.1
      const password = '123'

      // creation initiale des users
      createUsers(nbUsers, {
        password,
        nonConfirmed
      })
      .then(() => {
        // recherche des users confirmés, des genders, des orientations, ...
        async.parallel({
          users: (callback) => {
            User.find({bot: true, confirmed: true}, '_id username', callback)
          },
          genders: (callback) => {
            Gender.find({}, '_id', callback)
          },
          interests: (callback) => {
            Interest.find({}, '_id', callback)
          },
          files: (callback) => {
            fs.readdir('./public/images', callback)
          },
          cities: (callback) => {
            getLocalisationAll(nbUsers, callback)
          }
        }, function (err, results) {
          if(err) {
            callback(err, null)
            return
          }
          updateUsers(results, {
            nonCompleted,
            minAge,
            maxAge
          })
          .then(() => {
            // recherche des users complets pour gérer les relations, chats, notifications
            User.find({confirmed: 1, is_completed: 1}, '_id bot username', function(err, users) {
              if(err) {
                callback(err, null)
                return
              }
              createRelationsUsers(users, {
                nbUsers,
                maxLikes,
                maxFriends,
                nbChats,
                nbMessages,
                maxVisits,
                anonymVisit
              })
              .then(() => {
                updateScoreUsers()
                .then(() => {
                  callback(null, {
                    success: 1
                  })
                  return
                })
                .catch((err) => {
                  callback(err, null)
                  return
                })
              })
              .catch((err) => {
                callback(err, null)
                return
              })
            })
          })
          .catch((err) => {
            callback(err, null)
            return
          })
        })
      })
      .catch((err) => {
        callback(err, null)
        return
      })
  },
}

