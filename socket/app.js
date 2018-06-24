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
    // Enleve l'utilisateur des rooms
    const socketRooms = rooms.filter(r => r.sockets.find(s => s.id === socket.id))
    if (socketRooms) {
      socketRooms.forEach(r => {
        if (r.sockets.length < 2) {
          rooms.splice(rooms.findIndex(r2 => r2.id === r.id), 1)
        } else {
          r.sockets.splice(r.sockets.findIndex(s => s.id === socket.id), 1)
        }
      })
    }
    // Enleve l'utilisateur des utilisteurs connectes
    const authUser = authUsers.find(u => u.username === socket.username)
    if (authUser) {
      if (authUser.sockets.length < 2) {
        authUsers.splice(authUsers.findIndex(u => u.username === socket.username))
      } else {
        authUser.sockets.splice(authUser.sockets.findIndex(s => s.id === socket.id), 1)
      }
    }
    delete socket.username
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

  // Chat Room
  socket.on('CHAT_OPENROOM', function(data) {
    console.log('CHAT_OPENROOM', data.room._id, socket.username)
    const { room, usernames } = data
    socket.join(data.room._id)
    let socketRoom = rooms.find(r => r.id === room._id)
    if (socketRoom) {
      if (!socketRoom.sockets.find(s => s.id === socket.id)) {
        socketRoom.sockets.push(socket)
      }
    }
    else {
      rooms.push({
        id: room._id,
        usernames: usernames,
        sockets: [socket]
      })
    }
    socket.join(room._id)
    data = {
      id: room._id,
      username: socket.username
    }
    io.to(room._id).emit('CHAT_OPENROOM', data)
  })

  socket.on('CHAT_QUITROOM', function(id) {
    console.log('CHAT_QUITROOM', id, socket.username)
    let socketRoom = rooms.find(r => r.id === id)
    if (socketRoom) {
      if (socketRoom.sockets.length < 2) {
        rooms.splice(rooms.findIndex(r => r.id === id), 1)
      } else {
        socketRoom.sockets.splice(socketRoom.sockets.findIndex(s => s.id === socket.id), 1)
      }
    }
    socket.leave(id)
    const data = {
      id: id,
      username: socket.username
    }
    io.to(id).emit('CHAT_QUITROOM', data)
  })

  // Deconnexion d'un utilisateur
  socket.on('disconnect', function() {
    nbVisitors--
    disauthUser(socket)
  })
})
