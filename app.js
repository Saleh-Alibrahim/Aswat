const express = require('express')
const path = require('path')
const morgan = require('morgan')
const dotenv = require('dotenv')
const colors = require('colors');

// Load config
dotenv.config({ path: './config/config.env' })


const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes
app.use('/', require('./routes/index'))


const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow)
)

module.exports = app;
