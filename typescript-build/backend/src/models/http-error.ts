class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: Object[]
  ) {
    super(message);
  }
}

export default HttpError;
