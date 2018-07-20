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

function alertOthers(profile, isConnected) {
  if(profile) {
    let relations = []
    if (profile.friends) {
      relations = relations.concat(profile.friends)
    }
    if (profile.likes) {
      relations = relations.concat(profile.likes)
    }
    if (profile.likers) {
      relations = relations.concat(profile.likers)
    }
    relations.forEach(r => {
      if (authUsers.find(u => u.username === r.username)) {
        io.to(r.username).emit('IS_CONNECTED_RESPONSE', {
          username: profile.username,
          isConnected: isConnected
        })
      }
    })
  }
}

// Si l'utilisateur est authentifie (sur client), ajout a la liste des authentifies
function authUser(socket, profile) {
  if (profile && profile.username) {
    const username = profile.username
    socket.username = username
    const authUser = authUsers.find(u => u.username === username)
    if (authUser) {
      authUser.sockets.push(socket)
    } else {
      authUsers.push({
          username: username,
          sockets: [socket]
        }
      )
    }
    socket.join(username)
    // on prévient les amis de la connexion
    alertOthers(profile, true)
  }
  io.emit('NBUSERS_CHANGE', getUsersNb())
}

// Si l'utilisateur est authentifie (sur client), suppression de la liste des authentifies
function disauthUser(socket, profile) {
  if (socket.username) {
    // Enleve l'utilisateur des rooms
    const socketRooms = rooms.filter(r => r.sockets.find(s => s.id === socket.id))
    if (socketRooms) {
      socketRooms.forEach(r => {
        const data = {
          id: r.id,
          username: socket.username
        }
        io.to(r.id).emit('CHAT_QUIT_ROOM', data)
        socket.leave(r.id)
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

        // on prévient les amis de la deconnexion
        alertOthers(profile, false)
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

  socket.on('IDENTIFY_USER', function(profile) {
    authUser(socket, profile)
  })

  // socket.on('UNLOAD_USER', function(profile) {
  //   if (profile.username) {
  //     disauthUser(socket, profile)
  //   }
  // })

  // Reception d'un message de login
  socket.on('AUTH_LOGIN', function(profile) {
    authUser(socket, profile)
  })

  // Reception d'un message de logout
  socket.on('AUTH_LOGOUT', function(profile) {
    disauthUser(socket, profile)
  })

  // Chat Room
  socket.on('CHAT_OPEN_ROOM', function(data) {
    const { room, usernames } = data
    socket.join(room._id)
    let isOtherUserActive = false
    let socketRoom = rooms.find(r => r.id === room._id)
    if (socketRoom) {
      if (!socketRoom.sockets.find(s => s.id === socket.id)) {
        socketRoom.sockets.push(socket)
      }
      // l'autre user est-il connecté à la room
      if(socketRoom.sockets.findIndex(s => s.username !== socket.username) !== -1) {
        isOtherUserActive = true
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
      username: socket.username,
      isOtherUserActive: isOtherUserActive
    }
    // ouverture de la room
    io.to(room._id).emit('CHAT_OPEN_ROOM', data)
    // envoi du message de connection
    io.to(room._id).emit('IS_CONNECTED_RESPONSE', {
      username: usernames[0],
      isConnected: true
    })
  })

  socket.on('CHAT_QUIT_ROOM', function(id) {
    let socketRoom = rooms.find(r => r.id === id)
    let isOtherUserActive = false
    if (socketRoom) {
      if (socketRoom.sockets.length < 2) {
        rooms.splice(rooms.findIndex(r => r.id === id), 1)
      } else {
        socketRoom.sockets.splice(socketRoom.sockets.findIndex(s => s.id === socket.id), 1)
      }
      // l'utilisateur a t-il d'autres connexion
      if(socketRoom.sockets.findIndex(s => s.username === socket.username) !== -1) {
        isOtherUserActive = true
      }
      const data = {
        id: id,
        username: socket.username,
        isOtherUserActive: isOtherUserActive
      }
      io.to(id).emit('CHAT_QUIT_ROOM', data)
      socket.leave(id)
    }
  })

  socket.on('CHAT_SEND_MESSAGE', function(data) {
    // on envoie le message aux utilisateurs connectes au chat (autre que l'emetteeur)
    socket.broadcast.to(data.room).emit('CHAT_RECEIVE_MESSAGE', data)
  })

  // visite d'un utilisateur sur sa page
  socket.on('USER_VISITADD', function(username) {
    io.to(username).emit('AUTH_VISITADD')
  })

  // action de relation (like/unlike)
  socket.on('AUTH_RELATION', function(data) {
    let message = data.actor.username + ' vous a '
    message += (data.action === 'unlike') ? 'unliké.' : 'liké.'
    message += ' Vous êtes amis.'
    // fermeture du chat si un like et chat ouvert
    if (data.action === 'unlike') {
      const room = rooms.find(r => r.usernames.includes(data.actor.username) && r.usernames.includes(data.receptor.username))
      if (room) {
        let sockets = authUsers.find(u => u.username === data.actor.username).sockets
        sockets.forEach(s => s.leave(room.id))
        socket = authUsers.find(u => u.username === data.receptor.username)
        sockets.forEach(s => s.leave(room.id))
        rooms.splice(rooms.findIndex(r => room.id), 1)
      }
    }
    io.to(data.actor.username).emit('AUTH_RELATION', data)
    // si l'utilisateur recepteur est connecte
    if (authUsers.find(u => u.username === data.receptor.username)) {
      io.to(data.receptor.username).emit('AUTH_RELATION', data)
    }
  })

  // envoi d'une notification a username
  socket.on('NOTIFICATION_SEND', function(data) {
    io.to(data.username).emit('NOTIFICATION_RECEIVE', data)
  })

  // demande d'état de connexion d'un utilisateur
  socket.on('IS_CONNECTED_REQUEST', function(username) {
    const isConnected = authUsers.findIndex(u => u.username === username)
    socket.emit('IS_CONNECTED_RESPONSE', {
      username: username,
      isConnected: isConnected === -1 ? false : true
    })
  })

  // Changement de location
  socket.on('CHANGE_LOCATION', function(data) {
    socket.emit('CHANGE_LOCATION', data)
  })

  // Deconnexion d'un utilisateur
  socket.on('disconnect', function() {
    nbVisitors--
    disauthUser(socket, null)
  })
})
