const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
require('colors');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error');
const ErrorResponse = require('./utils/errorResponse');
const sslRedirect = require('heroku-ssl-redirect');
const cache = require('./config/cashe.js');

// Load config
dotenv.config({ path: './config/config.env' });


const app = express();

// Connect to the database
connectDB();

// Connect to redis cache
cache.connectCache();


// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




// Body parser
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Prevent XSS attack
app.use(xss());



// Prevent http param pollution
app.use(hpp());


// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Sanitize data 
app.use(mongoSanitize());


// Add libraries to the development environment
if (process.env.NODE_ENV === 'development') {

  // Logging
  app.use(morgan('dev'));

}

// Add libraries to the production environment
if (process.env.NODE_ENV === 'production') {

  // Redirect all the http to https
  app.use(sslRedirect());

  // Rate Limiting
  const Limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 10
  });

  app.use(Limiter);

}


// Routes
app.use('/create', require('./routes/createRoute'));
app.use('/vote', require('./routes/voteRoute'));
app.use('/', require('./routes/indexRoute'));

// Catch 404 to route does not exist and forward it to the error handler
app.use((req, res, next) => {
  return next(new ErrorResponse('الصفحة المطلوبة غير موجودة', 404));
});

// Handle all the errors
app.use(errorHandler);



const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`.yellow.bold));

module.exports = app;
