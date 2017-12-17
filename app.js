const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const index = require('./routes/index')
const users = require('./routes/users')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

// mongoose
mongoose.createConnection(process.env.MONGODB_URI, {server: {poolSize: process.env.MONGODB_POOL_SIZE}})
if (app.get('env') === 'development') {
  mongoose.set('debug', true)
}

app.use('/api/', index)
app.use('/api/users', users)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
