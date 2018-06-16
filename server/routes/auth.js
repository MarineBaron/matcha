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
      res.status(200).json({
        success: 1,
        data: result
      })
    } else {
      res.status(200).json({
        success: 0
      })
    }
  })
})

module.exports = router;
