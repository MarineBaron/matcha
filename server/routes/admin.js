const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin/adminController')
const verifyAdmin = require('../middleware/verifyAdmin')

/* GET all */
router.post('/users', verifyAdmin, function(req, res, next) {
  console.log('/users')
  adminController.findAll(req.body ,function (err, result) {
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

/* GET delete one */
router.get('/delete/:id', verifyAdmin, function(req, res, next) {
  adminController.deleteOne(req.params.id, function (err, result) {
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

/* GET delete bots */
router.get('/deletebots', verifyAdmin, function(req, res, next) {
  adminController.deleteBots(function (err, result) {
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

/* GET populate bots */
router.get('/createbots', verifyAdmin, function(req, res, next) {
  adminController.deleteBots(function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
    }
    adminController.createBots(function (err, result) {
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
})

module.exports = router

