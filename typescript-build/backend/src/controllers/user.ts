import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { generateError } from '../util/has-error';
import User from '../models/User';
import HttpError from '../models/http-error';

export const login: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return generateError(next, 'Validation Failed', 422, errors.array());
  }

  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email: email });
  if (!user) {
    return generateError(next, 'Email does not exist', 422);
  }
  const doMatch = await bcrypt.compare(password, user.password);
  if (!doMatch) {
    return generateError(next, 'Password is incorrect', 422);
  }

  const token = jwt.sign(
    {
      email: user.email,
      userId: user.id,
    },
    process.env.JWT_KEY || 'secret_fallback_key',
    { expiresIn: '1h' }
  );

  res.status(200).json({
    message: 'Logged In',
    token,
    userId: user.id,
  });
};

export const signup: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return generateError(next, 'Validation Failed', 422, errors.array());
  }
  if (!req.file) {
    return generateError(next, 'No image file provided', 422);
  }

  const { email, password, name } = req.body as {
    email: string;
    password: string;
    name: string;
  };
  try {
    const hashedPW = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPW,
      name,
      imageURL: req.file.filename,
      places: [],
    });
    await user.save();
    return res.status(200).json({
      message: 'Signup sucess',
    });
  } catch (err) {
    return next(err);
  }
};

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      generateError(next, 'Users undefined', 500);
    }
    const updatedUsers = users.map((user) => user.toObject({ getters: true }));
    console.log(updatedUsers);

    return res.status(200).json({
      message: 'Users fetched',
      users: updatedUsers,
    });
  } catch (err) {
    return next(err);
  }
};
