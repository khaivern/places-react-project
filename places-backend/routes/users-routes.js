const express = require('express');
const { body } = require('express-validator');
const fileUpload = require('../middleware/file-upload');

const usersController = require('../controllers/users-controller');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/login', usersController.login);

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    body('name').not().isEmpty(),
    body('email').normalizeEmail().isEmail(),
    body('password').isLength({ min: 4 }),
  ],
  usersController.signup
);

module.exports = router;
