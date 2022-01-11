import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { generateError } from '../util/has-error';

const isAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return generateError(next, 'Not Authorized', 401);
  }
  const token = authHeader.split(' ')[1];
  const decodedToken = jwt.verify(token, 'secretprivatekey');
  if (!decodedToken) {
    return generateError(next, 'Token is altered', 500);
  }
  const { userId } = decodedToken as { userId: string };
  req.userId = userId;
  next();
};

export default isAuth;
