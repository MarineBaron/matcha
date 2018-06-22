const express = require('express')
const app = express()

const server = app.listen(3001, function() {
    console.log('server running on port 3001')
});

const io = require('socket.io')(server)
let nbVisitors = 0
let authUsers = []
let rooms = []

function getUsersNb() {
  return {
    nbVisitors: nbVisitors,
    nbAuthUsers: authUsers.length
  }
}

// Si l'utilisateur est authentifie (sur client), ajout a la liste des authentifies
function authUser(socket, user) {
  if (user.username) {
    socket.username = user.username
    const authUser = authUsers.find(u => u.username === user.username)
    if (authUser) {
      authUser.sockets.push(socket)
    } else {
      authUsers.push({
          username: user.username,
          sockets: [socket]
        }
      )
    }
    socket.join(user.username)
  }
  io.emit('NBUSERS_CHANGE', getUsersNb())
}

// Si l'utilisateur est authentifie (sur client), suppression de la liste des authentifies
function disauthUser(socket) {
  if (socket.username) {
    const authUser = authUsers.find(u => u.username === socket.username)
    if (authUser) {
      if (authUser.sockets.length < 2) {
        authUsers.splice(authUsers.findIndex(u => u.username === socket.username))
      } else {
        authUser.sockets.splice(authUser.sockets.findIndex(s => s.id === socket.id), 1)
      }
    }
  }
  io.emit('NBUSERS_CHANGE', getUsersNb())
}

io.on('connection', function(socket) {
  nbVisitors++
  socket.on('IDENTIFY_USER', function(user) {
    console.log('IDENTIFY_USER', user)
    authUser(socket, user)
  })

  // Reception d'un message de login
  socket.on('AUTH_LOGIN', function(data) {
    console.log('AUTH_LOGIN', data)
    authUser(socket, data)
  })

  // Reception d'un message de logout
  socket.on('AUTH_LOGOUT', function(data) {
    console.log('AUTH_LOGOUT', data)
    disauthUser(socket)
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
    disauthUser(socket)
  })
})
