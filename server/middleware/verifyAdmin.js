const jwt = require('jsonwebtoken')

function verifyAdmin(req, res, next) {
  console.log('verifyAdmin')
  const token = req.headers['authorization']
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: 'No token provided.'
    })
  }
  jwt.verify(token, process.env.JWTSECRET, function(err, decoded) {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      })
    }
    if(decoded.username !== 'admin') {
      return res.status(500).send({
        auth: false,
        message: 'User is not admin.'
      })
    }
    req.user = decoded
    console.log('verifyAdmin OK')
    next();
  })
}

module.exports = verifyAdmin