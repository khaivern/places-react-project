const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  console.log(existingUser);
  if (existingUser) {
    const error = new HttpError(
      'E-mail already exists, please login instead',
      422
    );
    return next(error);
  }

  const hashedPW = await bcrypt.hash(password, 12);
  if (!hashedPW) {
    return next(new HttpError('could not create user', 500));
  }
  const createdUser = new User({
    email,
    name,
    imageUrl: req.file.path,
    password: hashedPW,
  });
  try {
    await createdUser.save();
  } catch (error) {
    const err = new HttpError('Signing Up Failed please try again', 500);
    return next(err);
  }

  let token;
  try {
    token = jwt.sign(
      {
        email: createdUser.email,
        userId: createdUser._id.toString(),
      },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (error) {
    return next(
      new HttpError('Signing up failed, please try again later', 500)
    );
  }

  res.status(201).json({
    message: 'Sign up success',
    userId: createdUser._id,
    email: createdUser.email,
    token,
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

  if (
    !existingUser ||
    !(await bcrypt.compare(password, existingUser.password))
  ) {
    const error = new HttpError('Could not log u in', 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        email: existingUser.email,
        userId: existingUser._id.toString(),
      },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (error) {
    return next(new HttpError('Login failed, please try again later', 500));
  }

  // let isValidPassword = false;
  // isValidPassword = await bcrypt.compare(password, existingUser.password)

  res.status(200).json({
    message: 'Login success',
    email: existingUser.email,
    userId: existingUser._id,
    token,
  });
};
