const express = require('express')
const app = express()

const server = app.listen(3001, function() {
    console.log('server running on port 3001')
});

const io = require('socket.io')(server)
let connectedUsers = []
let visitorsData = []
let nbUsers = 0
let nbConnectedUsers = 0
io.on('connection', function(socket) {
    nbUsers++
    // envoi du nombre de connectes a tout nouvel utilisateur
    io.emit('NBUSERS_CHANGE', {nbUsers: nbUsers, nbConnectedUsers: nbConnectedUsers})
    // creation d'un objet null pour cet utilisateur
    visitorsData[socket.id] = {}

    // Reception d'un mesage de login
    socket.on('AUTH_LOGIN', function(data) {
        //affectation du username au visiteur
        visitorsData[socket.id].username = data.username
        //ajout ou creation de la propriete connected
        if (!connectedUsers[data.username]) {
          connectedUsers[data.username] = {connected: true}
          nbConnectedUsers++
        } else {
          connectedUsers[data.username].connected = true
        }
        io.emit('NBUSERS_CHANGE', {nbUsers: nbUsers, nbConnectedUsers: nbConnectedUsers})
    })

    // Reception d'un mesage de logout
    socket.on('AUTH_LOGOUT', function(data) {
        //suppression de la propriete username sur tous les visiteurs associes
        visitorsData.filter(visitor => (
            visitor && visitor.username === data.username
          )).forEach((visitor) => {
            delete visitor.username
          })
        //suppression de l'utilisateur connecte
        if (connectedUsers[data.username]) {
          delete connectedUsers[data.username]
          nbConnectedUsers--
        }
        io.emit('NBUSERS_CHANGE', {nbUsers: nbUsers, nbConnectedUsers: nbConnectedUsers})
    })

    // Test Chat
    socket.on('SEND_MESSAGE', function(data) {
        io.emit('MESSAGE', data)
    })

    // Deconnexion d'un utilisateur
    socket.on('disconnect', function() {
      nbUsers--;
      // Suppression de l'utilisateur connecte associe,
      // s'il n'y a qu'une seule instance de visiteur associe a ce username
      if (visitorsData[socket.id].username) {
        const username = visitorsData[socket.id].username
        if (visitorsData.filter(visitor => (
            visitor && visitor.username === username
          )).length === 1) {
            if (connectedUsers[data.username]) {
              delete connectedUsers[data.username]
              nbConnectedUsers--
            }

          io.emit('BYEBYE', data.username)
        }
      }
      delete visitorsData[socket.id]
      io.emit('NBUSERS_CHANGE', {nbUsers: nbUsers, nbConnectedUsers: nbConnectedUsers})
    })
})
