const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load config
dotenv.config({ path: './config/config.env' });


const app = express();

// Connect to the database
connectDB();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', require('./routes/index'));

// Handle Errors 
app.use(errorHandler);





const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow));

module.exports = app;
