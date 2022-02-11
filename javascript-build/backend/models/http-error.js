class HttpError extends Error {
  constructor(message, errorCode, data = []) {
    super(message);
    this.code = errorCode;
    this.data = data;
  }
}

module.exports = HttpError;
