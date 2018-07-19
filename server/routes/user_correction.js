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

/* POST update */
router.post('/update', function(req, res, next) {
  console.log('server/routes/user.js', req.body)
  controller.update(req.body, function (err, result) {
    if (err) {
      console.log(err)
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    console.log('server/routes/user.js', result)
    res.status(200).json(result)
  })
})

/* get genders & interests */
// GASTON 10 : créer la requete qui retourne les genders et les interests
// router.get('/gendersinterests', ...) qui appelle une methode du controller
// ->getGendersInterests
router.get('/gendersinterests', function(req, res, next) {
  controller.getGendersInterests(function (err, result) {
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


/* POST update relations */
router.post('/relation', verifyToken, function(req, res, next) {
  controller.updateRelation(req.body, function (err, result) {
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

/* GET profile - Accès aux données complètes de l'utilisateur connecté. */
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

/* GET User - Friends Tous les amis de "username"*/
router.get('/friends/:username', function(req, res, next) {
  controller.findFriendsByUsername(req.params.username, function (err, result) {
    if (err){
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* GET user - Accès aux données d'un user lambda*/
router.get('/user/:username', function(req, res, next) {
  controller.findCompleteByUsername(req.params.username, function (err, result) {
    if (err) {
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* GET user Add One visit */
router.get('/addvisit/:username', function(req, res, next) {
  controller.addVisit(req.params.username, function (err, result) {
    if (err) {
      res.status(500).json({
        success: 0,
        error: err
      })
      return
    }
    res.status(200).json(result)
  })
})

/* GET user Accès à tous les users */
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





module.exports = router;
