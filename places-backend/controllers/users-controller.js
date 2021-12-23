const { validationResult } = require('express-validator');
const { v4: uuid } = require('uuid');
const HttpError = require('../models/http-error');

let USERS = [
  {
    id: 'u1',
    email: 'admin@gmail.com',
    name: 'USER 1',
    password: '1234',
  },
];

exports.getUsers = (req, res, next) => {
  res.status(200).json({
    message: 'USERS Fetched',
    users: USERS,
  });
};

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Validation Failed', 422);
  }
  const { email, name, password } = req.body;
  const hasUser = USERS.find(user => user.email === email);
  if (hasUser) {
    throw new HttpError('Email already exists', 422);
  }
  const createdUser = {
    id: uuid(),
    email,
    name,
    password,
  };
  USERS.push(createdUser);
  res.status(200).json({
    message: 'Sign up success',
    user: createdUser,
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = USERS.find(user => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      'Could not identify user, credentials seem to be wrong',
      401
    );
  }

  res.status(200).json({
    message: 'Login success',
  });
};
