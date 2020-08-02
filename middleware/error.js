const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  // Copy the error object
  let error = { ...err };

  // Log to console for dev
  console.log(err);

  let message = '';

  // Check what is the error and handle it 
  switch (err.name) {
    case 'NotFound':
      message = 'الصفحة المطلوبة غير موجودة';
      error = new ErrorResponse(message, 404);
      break;
  }




  const errorStatus = error.statusCode || 500;
  const errorMessage = error.message || 'مشكلة في السيرفر';

  res.status(errorStatus).render('error', {
    error: {
      success: false,
      status: errorStatus,
      message: errorMessage
    }
  });
};

module.exports = errorHandler;
