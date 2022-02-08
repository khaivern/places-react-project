import { NextFunction } from 'express';
import HttpError from '../models/http-error';

export const generateError = (
  next: NextFunction,
  message: string,
  code: number,
  data?: Object[]
) => {
  const error = new HttpError(message, code, data);
  return next(error);
};
