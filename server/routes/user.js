var express = require('express');
var router = express.Router();
var controller = require('../controllers/userController')

/* GET profile */
router.get('/profile/:username', function(req, res, next) {
  controller.findByUsername(req.params.username, function (err, result) {
    console.log(result, err)
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
        data: result.data
      })
    } else {
      res.status(200).json({
        success: 0
      })
    }
  })
})

module.exports = router;
