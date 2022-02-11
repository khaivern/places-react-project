const express = require('express');
const {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  getAllPlaces,
  updatePlace,
  deletePlace,
} = require('../controllers/places.controller');
const { body } = require('express-validator');
const fileUpload = require('../middleware/file-upload');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/', getAllPlaces);

router.get('/:pid', getPlaceById);

router.get('/user/:uid', getPlaceByUserId);

router.use(isAuth); // custom middle-ware

router.post(
  '/',
  fileUpload.single('image'),
  [
    body('title', 'Invalid title').trim().notEmpty(),
    body('description', 'Invalid description').trim().isLength({ min: 5 }),
    body('address', 'Invalid address').trim().notEmpty(),
  ],
  createPlace
);

router.patch(
  '/:pid',
  [
    body('title', 'Invalid title').trim().notEmpty(),
    body('description', 'Invalid description').trim().isLength({ min: 5 }),
  ],
  updatePlace
);

router.delete('/:pid', deletePlace);

module.exports = router;
