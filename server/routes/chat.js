const express = require('express');
const router = express.Router();
const roomController = require('../controllers/chat/roomController')
const messageController = require('../controllers/chat/messageController')
const verifyToken = require('../middleware/verifyToken')

/* GET all rooms */
router.get('/rooms', verifyToken, function(req, res, next) {
  roomController.getAll(function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* GET one room */
router.get('/room/:id', verifyToken, function(req, res, next) {
  roomController.getOne(req.params.id, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* POST one room = create one room */
router.post('/room', verifyToken, function(req, res, next) {
  const users = [
    {username: req.body.username1},
    {username: req.body.username2},
  ]
  roomController.create(users, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* POST more */
router.post('/messages/more', verifyToken, function(req, res, next) {
  messageController.getNewMessages(req.body.room, req.body.lastCreated, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* GET delete one room */
router.get('/room/delete/:id', verifyToken, function(req, res, next) {
  roomController.delete(req.params.id, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* GET all message in a room */
router.get('/messages/:id', verifyToken, function(req, res, next) {
  messageController.getAllByRoom(id, function(err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* GET one message */
router.get('/message/:id', verifyToken, function(req, res, next) {
  messageController.getOne(id, function(err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* POST one message */
router.post('/message', verifyToken, function(req, res, next) {
  if (!req.body.id) {
    messageController.create(req.body, function (err, result) {
      if (err) {
        console.log(err)
        res.status(500).json({
          success: 0,
          error: err
        })
        return
      }
      res.status(200).json(result)
    })
  } else {
    messageController.update(req.body, function (err, result) {
      if (err) {
        console.log(err)
        res.status(500).json({
          success: 0,
          error: err
        })
        return
      }
      res.status(200).json(result)
    })
  }
})

/* GET delete one message */
router.get('/message/delete/:id', verifyToken, function(req, res, next) {
  messageController.delete(id, function(err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

module.exports = router
