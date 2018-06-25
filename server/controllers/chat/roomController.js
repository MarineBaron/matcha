const async = require('async')
const ChatMessage = require('../../models/chat/message')
const ChatRoom = require('../../models/chat/room')
const User = require('../../models/user')
const messageController = require('./messageController')

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
        User.findOne({username: users[0].username}, callback)
      },
      user2: function(callback) {
        User.findOne({username: users[1].username}, callback)
      },
    }, function(err, users) {
      if (err) {
        callback(err, null)
        return
      }
      ChatRoom.findOne({$and: [{users: users.user1._id}, {users: users.user2._id}]})
        .exec(function (err, room) {
        if (err) {
          callback(err, null)
          return
        }
        if (room && room.users) {
          console.log('room exists')
          let newRoom =  {
            _id: room._id,
            users: room.users,
            messages: []
          }
          messageController.getAllByRoom(room._id, function(err, result) {
            if (err) {
              callback(err, null)
              return
            }
            if (result && result.success && result.data) {
              result.data.forEach(m => {
                newRoom.messages.push(
                  {
                    id: m._id,
                    room: room._id,
                    created: m.created,
                    username: m.user.username,
                    message: m.message,
                  }
                )
              })
            }
            callback(null, {
              success: 1,
              data: {
                usernames : [users.user1.username, users.user2.username],
                room: newRoom,
              }
            })
          })
          return
        }
        console.log('new room is created')
        const newRoom = new ChatRoom({
          users: [
            {_id: users.user1._id},
            {_id: users.user2._id}
          ]
        })
        newRoom.save(function(err, newRoom) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, {
              success: 1,
              data: {
                usernames : [users.user1.username, users.user2.username],
                room: newRoom
              }
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
