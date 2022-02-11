const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization'); // req.headers.authorization
    if (!authHeader) {
      throw new Error('Failed');
    }
    const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
    if (!token) {
      throw new Error('Failed');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decodedToken.userId;
    return next();
  } catch (err) {
    const error = new HttpError('Authentication failed', 403);
    return next(error);
  }
};

module.exports = isAuth;
