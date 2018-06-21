const express = require('express')
const app = express()

const server = app.listen(3001, function() {
    console.log('server running on port 3001')
});

const io = require('socket.io')(server)
let connectedUsers = []
//let visitorsData = []
let rooms = []
let nbVisitors = 0
let nbConnectedUsers = 0
io.on('connection', function(socket) {
  nbVisitors++
  // envoi du nombre de connectes a tout nouvel utilisateur
  io.emit('NBUSERS_CHANGE', {nbUsers: nbVisitors, nbConnectedUsers: nbConnectedUsers})

  // Reception d'un message de login
  socket.on('AUTH_LOGIN', function(data) {
    const connectedUser = connectedUsers.find(user => user.username === data.username)
    if (connectedUser) {
      connectedUser.sockets.push(socket)
    } else {
      connectedUsers.push({
          username: data.username,
          sockets: [socket]
        }
      )
      nbConnectedUsers++
    }
    io.emit('NBUSERS_CHANGE', {nbUsers: nbVisitors, nbConnectedUsers: nbConnectedUsers})
  })

  // Reception d'un message de logout
  socket.on('AUTH_LOGOUT', function(data) {
    const index = connectedUsers.findIndex(user => user.username === data.username)
    connectedUsers.splice(index, 1)
    nbConnectedUsers--
    io.emit('NBUSERS_CHANGE', {nbUsers: nbVisitors, nbConnectedUsers: nbConnectedUsers})
  })

  // Test Chat
  socket.on('CHAT_OPENROOM', function(data) {
    const { room, usernames } = data
    let sRoom = rooms.find(r => r.id === room._id)
    if (sRoom) {
      sRoom.users.push(usernames[0])
    } else {
      rooms.push({
        id: room._id,
        users: [usernames[0]]
      })
      sRoom = rooms[rooms.length - 1]
    }
    const connectedUser = connectedUsers.find(user => user.username === usernames[0])
    connectedUser.sockets.forEach(skt => {skt.join(sRoom.id)})
    //socket.join(sRoom.id)
    console.log("existants rooms", rooms)
    io.to(sRoom.id).emit('CHAT_OPENROOM', usernames[0])
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
        nbConnectedUsers--
      } else {
        index = connectedUsers.sockets.findIndex(skt => skt.id === socket.id)
        connectedUsers.sockets.splice(index, 1)
      }
    }
    // Suppression de l'utilisateur connecte associe,
    // s'il n'y a qu'une seule instance de visiteur associe a ce username
    // if (visitorsData[socket.id].username) {
    //   const username = visitorsData[socket.id].username
    //   if (visitorsData.filter(visitor => (
    //       visitor && visitor.username === username
    //     )).length === 1) {
    //       if (connectedUsers[data.username]) {
    //         delete connectedUsers[data.username]
    //         nbConnectedUsers--
    //       }
    // 
    //     io.emit('BYEBYE', data.username)
    //   }
    // }
    //delete visitorsData[socket.id]
    io.emit('NBUSERS_CHANGE', {nbUsers: nbVisitors, nbConnectedUsers: nbConnectedUsers})
  })
})
