const errorHandler = (error, req, res, next) => {

  // Log to console for dev
  console.log(error);

  const errorStatus = error.statusCode || 500;

  if (errorStatus == 500) {
    error.message = 'مشكلة في السيرفر';
  }

  if (!error.json) {
    res.status(errorStatus).render('errorView', {
      error: {
        success: false,
        status: errorStatus,
        message: error.message
      }
    });
  } else {
    res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: error.message
    });
  }
};

module.exports = errorHandler;
