class ErrorResponse extends Error {
  constructor(message, statusCode, json = false) {
    super(message);
    this.statusCode = statusCode;
    this.json = json;

    Error.captureStackTrace(this, this.constructor);
  }
}



module.exports = ErrorResponse;
