const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController')
const verifyToken = require('../middleware/verifyToken')
const multer = require('multer')
const upload = multer({ dest: 'public/tmp' })

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
  controller.update(req.body, function (err, result) {
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

/* POST files */
router.post('/gallery/:username', upload.array('gallery', 12), function(req, res, next) {
  controller.uploadFiles(req.params.username, req.files, function (err, result) {
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

/* POST files */
router.get('/avatar/:username/:id', verifyToken, function(req, res, next) {
  controller.chooseAvatar(req.params.username, req.params.id, function (err, result) {
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

/* GET deleteImg */
router.get('/gallerydelete/:username/:id', verifyToken, function(req, res, next) {
  controller.deleteImage(req.params.username, req.params.id, function (err, result) {
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

/* POST update relations */
router.post('/updatelocation', verifyToken, function(req, res, next) {
  if (req.user.username !== req.body.username) {
    console.log(err)
    res.status(500).json({
      success: 0,
      error: 'ACCESS_DENIED'
    })
    return
  }
  controller.updateLocation(req.body, function (err, result) {
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
router.get('/users/:nbByPage/:page', function(req, res, next) {
  controller.findUsers(req.params.nbByPage, req.params.page, function (err, result) {
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

/* GET gender Accès à tous les genres */
router.get('/genders', function(req, res, next) {
  controller.findGenders(function (err, result) {
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

/* GET infos */
router.get('/infos/:username', verifyToken, function(req, res, next) {
  controller.getInfos(req.params.username, function(err, result) {
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

/* GET matching */
router.post('/match', verifyToken, function(req, res, next) {
  //console.log(req.body)
  controller.findMatch(req.body, function(err, result) {
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





module.exports = router;
