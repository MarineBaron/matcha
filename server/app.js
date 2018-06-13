var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

/* Variables d'environnement */
require('dotenv').config()

/* Application */
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Base de données & ORM */
const mongoose = require('mongoose')
const dbURL = process.env.MONGO_DB_URL
mongoose.connect(dbURL, function(err){
  if(err){
    console.log('Error connecting to: '+ dbURL)
  }
  else{
    console.log('Connected to: '+ dbURL)
  }
})

/* Routeur */
app.get('/', function(req, res) {
  res.status(200)
  res.json({message: 'Matcha API'})
});

var authRouter = require('./routes/auth');
// var userRouter = require('./routes/user');
// var tagRouter = require('./routes/tag');
// var chatRouter = require('./routes/chat');
app.use('/auth', authRouter);
// app.use('/user', userRouter);
// app.use('/tag', tagRouter);
// app.use('/chat', chatRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

/* Gestion des erreurs */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
