var express = require('express');
var router = express.Router();
var controller = require('../controllers/authController')

/* POST login */
router.post('/login', function(req, res, next) {
  authController.login(req.body.username, req.body.password, function(err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    if (result) {
      res.status(200).json({
        success: 1,
        data: {
          token: result.token,
          username: result.username,
          role: result.role
        }
      })
    } else {
      res.status(200).json({
        success: 0,
        data: result
      })
    }
  })
});

/* POST register */
router.post('/register', function(req, res, next) {
  authController.register(req.body.username, req.body.password, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    if (result) {
      res.status(200).json({
        success: 1,
        data: {token: result}
      })
    } else {
      res.status(200).json({
        success: 0,
        data: result
      })
    }
  })
});

/* POST logout */
router.post('/logout', function(req, res, next) {
  authController.logout(req.params.token, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    if (result) {
      res.status(200).json({
        success: 1
      })
    } else {
      res.status(200).json({
        success: 0
      })
    }
  })
});

module.exports = router;
