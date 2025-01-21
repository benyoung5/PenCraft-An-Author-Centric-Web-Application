class HttpError extends Error {
    constructor(message, errorCode) {
      super(message);
      this.code = errorCode; // Added a semicolon at the end
    }
  }
  
  module.exports = HttpError;
  