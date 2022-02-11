const fs = require('fs');

const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const User = require('../models/users.models');
const Place = require('../models/places.models');
const getLocation = require('../util/location');
const mongoose = require('mongoose');

const getAllPlaces = async (req, res, next) => {
  let places;
  try {
    places = await Place.find();
  } catch (err) {
    return next(new HttpError('Database Failed', 500));
  }
  return res.status(200).json({
    message: 'Places fetched',
    places,
  });
};

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(err);
  }
  if (!place) {
    return next(
      new HttpError('Could not find a place with the provided id', 404)
    );
  }
  return res.status(200).json({
    place: place.toObject({ getters: true }),
  });
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(new HttpError('Database Failed', 500));
  }

  if (!places) {
    return next(
      new HttpError('Could not find a place with the provided user id', 404)
    );
  }
  return res.status(200).json({
    message: 'Fetched User places',
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation failed', 422));
  }
  const { title, description, address } = req.body;
  const creator = req.userId;
  let location;
  try {
    location = await getLocation(address);
  } catch (err) {
    return next(err);
  }

  const createdPlace = new Place({
    title,
    description,
    imageUrl: req.file.path.replaceAll('\\', '/'),
    location,
    address,
    creator,
  });

  let user;
  try {
    user = await User.findOne({ _id: creator });
  } catch (err) {
    return next(new HttpError('Fetching from DB failed', 500));
  }

  if (!user) {
    return next(new HttpError('No user found', 404));
  }

  let result;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    result = await createdPlace.save({ session: session });
    user.places.push(createdPlace);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating place failed', 500);
    return next(error);
  }
  return res.status(201).json({
    message: 'Created place',
    place: result.toObject({ getters: true }),
  });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation failed', 422));
  }
  const { pid } = req.params;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    return next(new HttpError('Database Failed', 500));
  }

  if (!place) {
    return next(new HttpError('Could not find place', 404));
  }

  place.title = title;
  place.description = description;

  if (req.userId !== place.creator.toString()) {
    return next(new HttpError('Not Authorized Request', 401));
  }

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError('Could not save place', 500));
  }

  return res.status(200).json({
    message: 'Updated Place',
    place: place.toObject({ getters: true }),
  });
};

const deletePlace = async (req, res, next) => {
  const { pid } = req.params;
  let place;
  try {
    place = await Place.findOne({ _id: pid }).populate('creator');
  } catch (err) {
    return next(new HttpError('Database Failed', 500));
  }

  if (!place) {
    return next(new HttpError('Could not find place'));
  }

  const imagePath = place.imageUrl;

  if (req.userId !== place.creator.id) {
    return next(new HttpError('Not Authorized Request', 401));
  }

  let result;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    result = await place.delete({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Could not delete place', 500));
  }

  fs.unlink(imagePath, (err) => {});

  return res.status(200).json({
    message: 'Place Deleted',
    place: result.toObject({ getters: true }),
  });
};

module.exports = {
  getAllPlaces,
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
