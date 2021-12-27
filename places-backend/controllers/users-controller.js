const { validationResult } = require('express-validator');
const { v4: uuid } = require('uuid');

const HttpError = require('../models/http-error');
const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find().select('-password');
  } catch (error) {
    const err = new HttpError('Fetching users failed', 500);
    return next(err);
  }

  res.status(200).json({
    message: 'USERS Fetched',
    users: users.map(user => user.toObject({ getters: true })),
  });
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation Failed', 422));
  }
  const { email, name, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up failed, try again later', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'E-mail already exists, please login instead',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    email,
    name,
    imageUrl:
      'https://i.picsum.photos/id/559/600/600.jpg?hmac=w4zg0TUhTkdONfFzRK39BC2ZnYhY97H7FMq9eIVAyNM',
    password,
  });
  try {
    await createdUser.save();
  } catch (error) {
    const err = new HttpError('Signing Up Failed please try again', 500);
    return next(err);
  }
  res.status(200).json({
    message: 'Sign up success',
    user: createdUser.toObject({ getters: true }),
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Login failed, try again later', 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Could not log u in', 401);
    return next(error);
  }

  res.status(200).json({
    message: 'Login success',
    user: existingUser.toObject({ getters: true }),
  });
};
