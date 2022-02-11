const express = require('express');
const { body } = require('express-validator');

const {
  getAllUsers,
  signUp,
  login,
} = require('../controllers/users.controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', getAllUsers);

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Invalid Password').trim().isLength({ min: 4 }),
    body('name', 'Invalid Name').trim().notEmpty(),
  ],
  signUp
);

router.post(
  '/login',
  [
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Invalid Password').trim().isLength({ min: 4 }),
  ],
  login
);

module.exports = router;
