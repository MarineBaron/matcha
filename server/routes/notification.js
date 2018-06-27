const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification/notificationController')
const verifyToken = require('../middleware/verifyToken')

/* GET all notifications by user */
router.get('/notifications/:username', verifyToken, function(req, res, next) {
  notificationController.getAllByUser(req.params.username, function (err, result) {
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

/* GET all unread notifications by user */
router.get('/notifications/unread/:username', verifyToken, function(req, res, next) {
  notificationController.getAllUnreadByUser(req.params.username, function (err, result) {
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

/* GET one notification */
router.get('/notification/:id', verifyToken, function(req, res, next) {
  notificationController.getOne(req.params.id, function (err, result) {
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

/* POST one notification = create one notification */
router.post('/notification', verifyToken, function(req, res, next) {
  notificationController.create(req.body, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    console.log(result)
    res.status(200).json(result)
  })
})

/* GET delete one notification */
router.get('/notification/delete/:id', verifyToken, function(req, res, next) {
  notificationController.delete(req.params.id, function (err, result) {
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

/* GET one notification = create one notification */
router.get('/notification/:id/:read', verifyToken, function(req, res, next) {
  notificationController.setRead(req.params.id, req.params.read, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    console.log(result)
    res.status(200).json(result)
  })
})



/* GET delete all notifications by user */
router.get('/notifications/delete/:username', verifyToken, function(req, res, next) {
  notificationController.deleteAllByUser(req.params.username, function (err, result) {
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
