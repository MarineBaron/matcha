var express = require('express');
var router = express.Router();
var controller = require('../controllers/authController')

/* POST login */
router.post('/login', function(req, res, next) {
  controller.login(req.body.username, req.body.password, function(err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    if (result) {
      res.status(200).json(result)
    } else {
      res.status(200).json({
        success: 0
      })
    }
  })
})

/* POST confirm */
router.post('/confirm', function(req, res, next) {
  controller.confirm(req.body.username, req.body.token, function(err, result) {
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

module.exports = router;
