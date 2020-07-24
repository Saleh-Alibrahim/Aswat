const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  // Copy the error object
  let error = { ...err };

  // Log to console for dev
  console.log(err.name);

  let message = '';

  // Check what is the error and handle it 
  switch (err.name) {
    case 'NotFound':
      message = 'الصفحة المطلوبة غير موجودة';
      error = new ErrorResponse(message, 404);
      break;
    case 'CastError':
      message = 'الصفحة المطلوبة غير موجودة';
      error = new ErrorResponse(message, 404);
      break;
  }






  res.status(error.statusCode || 500).render('error', {
    error: {
      success: false,
      status: error.statusCode || 500,
      message: error.message || 'مشكلة في السيرفر'
    }
  });
};

module.exports = errorHandler;
