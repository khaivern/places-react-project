const fs = require('fs');
const HttpError = require('../models/http-error');

const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(err);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find place for the provided ID',
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    const err = new HttpError(
      'Could not find places with given creator ID',
      404
    );
    return next(err);
  }
  if (!places) {
    const error = new HttpError(
      'Could not find place for the provided user ID',
      404
    );

    return next(error);
  }
  places = places.map(place => ({ ...place._doc, id: place._id.toString() }));
  res.json({ places });
};

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation Failed', 422));
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    return next(err);
  }
  const createdPlace = new Place({
    imageUrl: req.file.path,
    title,
    description,
    location: coordinates,
    address,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    const err = new HttpError('Creating place failed', 500);
    return next(err);
  }

  if (!user) {
    return next(new HttpError('User could not be found', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log('Error here ', error.message);
    const err = new HttpError('Creating place failed', 500);
    return next(err);
  }

  res.status(201).json({
    message: 'Place Created Successfully',
    place: createdPlace,
  });
};

exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Validation Failed', 422));
  }
  const pid = req.params.pid;
  const { title, description } = req.body;

  let updatedPlace;
  try {
    updatedPlace = await Place.findById(pid);
    if (updatedPlace.creator.toString() !== req.userData.userId) {
      throw new Error();
    }
    updatedPlace.title = title;
    updatedPlace.description = description;
    await updatedPlace.save();
  } catch (error) {
    const err = new HttpError('something went wrong', 404);
    return next(err);
  }

  res.status(200).json({
    message: 'Updated Successfully',
    place: updatedPlace.toObject({ getters: true }),
  });
};

exports.deletePlace = async (req, res, next) => {
  const pid = req.params.pid;

  let place;
  try {
    place = await Place.findById(pid).populate('creator');
    if (!place) {
      const error = new HttpError(
        'Could not find place associated with given id',
        500
      );
      throw error;
    }
  } catch (error) {
    const err = new HttpError(error.message || 'Something went wrong', 500);
    return next(err);
  }

  if (place.creator._id.toString() !== req.userData.userId) {
    return next(new HttpError('Not Authorized to Delete', 401));
  }

  const imagePath = place.imageUrl;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    const err = new HttpError('Something went wrong', 500);
    return next(err);
  }

  fs.unlink(imagePath, err => console.log(err));
  res.status(200).json({
    message: 'Deleted place',
  });
};
