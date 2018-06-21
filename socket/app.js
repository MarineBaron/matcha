const express = require('express')
const app = express()

const server = app.listen(3001, function() {
    console.log('server running on port 3001')
});

const io = require('socket.io')(server)
let nbVisitors = 0
let connectedUsers = []
let rooms = []

function getUsersNb() {
  return {
    nbUsers: nbVisitors,
    nbConnectedUsers: connectedUsers.length
  }
}

io.on('connection', function(socket) {
  nbVisitors++
  // envoi du nombre de connectes a tout nouvel utilisateur
  io.emit('NBUSERS_CHANGE', getUsersNb())

  // Reception d'un message de login
  socket.on('AUTH_LOGIN', function(data) {
    console.log('AUTH_LOGIN', data.username)
    const connectedUser = connectedUsers.find(user => user.username === data.username)
    if (connectedUser) {
      connectedUser.sockets.push(socket)
    } else {
      connectedUsers.push({
          username: data.username,
          sockets: [socket]
        }
      )
    }
    io.emit('NBUSERS_CHANGE', getUsersNb())
  })

  // Reception d'un message de logout
  socket.on('AUTH_LOGOUT', function(data) {
    const index = connectedUsers.findIndex(user => user.username === data.username)
    connectedUsers.splice(index, 1)
    io.emit('NBUSERS_CHANGE', getUsersNb())
  })

  // Test Chat
  socket.on('CHAT_OPENROOM', function(data) {
    const { room, usernames } = data
    console.log('CHAT_OPENROOM', room._id)
    let sRoom = rooms.find(r => r.id === room._id)
    if (sRoom) {
      console.log("Room exists", sRoom)
      if (!sRoom.users.find(user => user === usernames[0])) {
        sRoom.users.push(usernames[0])
      }
    } else {
      rooms.push({
        id: room._id,
        users: [usernames[0]]
      })
      sRoom = rooms[rooms.length - 1]
      console.log("New Room", sRoom)
    }
    const connectedUser = connectedUsers.find(user => user.username === usernames[0])
    connectedUser.sockets.forEach(skt => {skt.join(sRoom.id)})
    console.log("existants rooms", rooms)
    io.to(sRoom.id).emit('CHAT_OPENROOM', usernames[0])
  })

  socket.on('CHAT_QUITROOM', function(id, username) {
    console.log('CHAT_QUITROOM', id)
    let sRoom = rooms.find(r => r.id === id)
    const connectedUser = connectedUsers.find(user => user.username === username)
    connectedUser.sockets.forEach(skt => {skt.leave(sRoom.id)})

    if (sRoom.users.length == 1) {
      rooms.splice(rooms.findIndex(r => r.id === id), 1)
    } else {
      sRoom.users.splice(sRoom.users.findIndex(user => user === usernane), 0)
    }
    console.log("existants rooms", rooms)
    io.to(sRoom.id).emit('CHAT_QUITROOM', username)
  })

  // Deconnexion d'un utilisateur
  socket.on('disconnect', function() {
    nbVisitors--
    let index
    const connectedUser = connectedUsers.find(user => user.sockets.find(skt => skt.id === socket.id))
    if (connectedUser) {
      if (connectedUser.sockets.length === 1) {
        index = connectedUsers.findIndex(user => user.username === connectedUser.username)
        connectedUsers.splice(index, 1)
      } else {
        index = connectedUsers.sockets.findIndex(skt => skt.id === socket.id)
        connectedUsers.sockets.splice(index, 1)
      }
    }
    io.emit('NBUSERS_CHANGE', getUsersNb())
  })
})
