const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  console.log('wqerwqrtwqrwq :>> ');
  error.message = err.message;

  // Log to console for dev
  console.log(err);


  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).render('error', {
    error: {
      success: false,
      status: error.statusCode,
      message: error.message || 'مشكلة في السيرفر'
    }
  });
};

module.exports = errorHandler;
