const { hash, compare } = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/users.models');

const HttpError = require('../models/http-error');
const sendToCloudinary = require('../util/file-upload');

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    return next(new HttpError('Failed to fetch from database', 500));
  }

  return res.status(200).json({
    message: 'Fetched All Users',
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation Failed', 422, errors.array()));
  }

  const { email, password, name } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('Database Failed to fetch', 500));
  }

  if (user) {
    return next(new HttpError('Email already exists', 422));
  }

  const hashedPW = await hash(password, 12);

  const imagePath = req.file.path.replaceAll('\\', '/');
  const imageUrl = await sendToCloudinary(imagePath);

  const newUser = new User({
    name,
    email,
    password: hashedPW,
    imageUrl,
  });

  let result;
  try {
    result = await newUser.save();
  } catch (err) {
    return next(new HttpError('Failed To save user credentials', 500));
  }

  let token;
  try {
    token = jwt.sign(
      {
        email: result.email,
        userId: result.id,
        name: result.name,
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    return next(new HttpError('Failed to create token', 500));
  }

  return res.status(201).json({
    message: 'Created new user',
    user: {
      id: result.id,
      token: token,
    },
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation Failed', 422, errors.array()));
  }

  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('Failed to fetch from database', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user with that email', 422));
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    return next(new HttpError('Could not validate u', 422));
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_KEY,
      {
        expiresIn: '1h',
      }
    );
  } catch (err) {
    return next(new HttpError('Failed to create token', 500));
  }

  return res.status(200).json({
    message: 'Logged In Successful',
    user: {
      id: user.id,
      token: token,
    },
  });
};

module.exports = {
  getAllUsers,
  signUp,
  login,
};
