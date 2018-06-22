const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController')
const verifyToken = require('../middleware/verifyToken')

/* POST create */
router.post('/create', function(req, res, next) {
  controller.create(req.body.username, req.body.email, req.body.password, function (err, result) {
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

/* GET profile */
router.get('/profile', verifyToken, function(req, res, next) {
  controller.findById(req.user._id, function (err, result) {
    if (err) {
      console.log('Route KO : /profile L25', err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    console.log('Route OK : /profile L32', result)
    res.status(200).json(result)
  })
})

/* GET user */
router.get('/user/:username', function(req, res, next) {
  // console.log('/user/:username')
  controller.findCompleteByUsername(req.params.username, function (err, result) {
    if (err) {
      // console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* GET user */
router.get('/users', function(req, res, next) {
  controller.findAll(function (err, result) {
    if (err) {
      // console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* GET User Friends */
router.get('/friends/:username', function(req, res, next) {
  console.log('Nouvel methode !!!')
  controller.findFriendsByUsername(req.params.username, function (err, result) {
    if (err){
      console.log('Routes/user.js L73 :' + err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

module.exports = router;
