const async = require('async')
const ChatMessage = require('../../models/chat/message')
const ChatRoom = require('../../models/chat/room')
const User = require('../../models/user')

module.exports = {
  getOne: function(id, callback) {
    ChatRoom.findById(id)
      .populate('users')
      .populate('messages')
      .exec(function(err, room) {
        if (err) {
          callback(err, null)
          return
        }
        if (!room) {
          callback(null, {
            success: 0,
            message: 'INEXISTANT MESSAGE'
          })
          return
        }
        callback(null, {
          success: 1,
          data: room
        })
      }) 
  },
  getAll: function(callback) {
    ChatRoom.find()
      .populate('users')
      .exec(function(err, rooms) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, {
          success: 1,
          data: rooms
        })
      })
  },
  /* On ne cree une nouvelle room que si elle n'existe pas pour les 2 users
  /* Si elle existe deja, on la renvoie */
  create: function(users, callback) {
    async.parallel({
      user1: function(callback) {
        user.find({username: users[0].username}, callback)
      },
      user2: function(callback) {
        user.find({username: users[1].username}, callback)
      },
    }, function(err, users) {
      if (err) {
        callback(err, null)
        return
      }
      ChatRoom.find($and: [
        {user: user1},
        {user: user2}
      ], function (err, room) {
        if (err) {
          callback(err, null)
          return
        }
        if (room) {
          callback(null, {
            success: 1,
            data: room
          })
          return
        }
        const newRoom = new Room({
          users: [user1, user2]
        })
        newRoom.save(function(err, callback) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, {
              success: 1,
              data: newRoom
          })
        })
      })
    })
  },
  delete: function(id, callback) {
    ChatMessage.deleteMany({room: id}, function(err) {
      if (err) {
        callback(err, null)
        return
      }
      ChatRoom.deleteOne({_id: id}, function(err) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, {
            success: 1
        })
      })
    })
  }
}
