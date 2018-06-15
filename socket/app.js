const express = require('express')
const app = express()

const server = app.listen(3001, function() {
    console.log('server running on port 3001')
});

const io = require('socket.io')(server)
let nbUsers = 0
io.on('connection', function(socket) {
    console.log(socket.id)
    nbUsers++
    io.emit('NBUSERS_CHANGE', nbUsers)
    socket.on('SEND_MESSAGE', function(data) {
        io.emit('MESSAGE', data)
    })
    socket.on('disconnect', function() {
      io.emit('BYEBYE', socket.id)
      nbUsers--
      io.emit('NBUSERS_CHANGE', nbUsers)
    })
})
