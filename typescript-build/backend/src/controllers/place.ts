import mongoose from 'mongoose';
import { RequestHandler } from 'express';
import Place from '../models/Place';
import { generateError } from '../util/has-error';
import { getLocation } from '../util/get-location';
import User from '../models/User';
import HttpError from '../models/http-error';
import { validationResult } from 'express-validator';
import clearImage from '../util/clear-image';

export const createPlace: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return generateError(next, 'Place Validation Failed', 422, errors.array());
  }

  const { title, description, address } = req.body as {
    title: string;
    description: string;
    address: string;
  };
  const location = await getLocation(address);
  if (!req.file) {
    return generateError(next, 'No image provided', 422);
  }
  const place = new Place({
    title,
    description,
    address,
    coordinates: location,
    creatorId: req.userId,
    imageURL: req.file.filename,
  });

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return next(new HttpError('User not found', 422));
    }
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const placeRes = await place.save({ session: sess });
    user.places.push(placeRes);
    await user.save({ session: sess });
    await sess.commitTransaction();
    res.status(201).json({
      message: 'Place Created',
      place: placeRes,
    });
  } catch (err) {
    return next(err);
  }
};

export const getUserPlaces: RequestHandler = async (req, res, next) => {
  const uId = req.params.uId;
  try {
    const places = await Place.find({ creatorId: uId });
    if (!places) {
      return generateError(next, 'Places Undefined', 404);
    }
    const updatedPlaces = places.map((place) =>
      place.toObject({ getters: true })
    );
    return res.status(200).json({
      message: 'Places Fetched',
      places: updatedPlaces,
    });
  } catch (err) {
    return next(err);
  }
};

export const getPlace: RequestHandler = async (req, res, next) => {
  const pId = req.params.pId;
  try {
    const place = await Place.findById(pId);
    if (!place) {
      return generateError(next, 'Place not found', 422);
    }
    return res.status(200).json({
      message: 'Place Fetched',
      place: place.toObject({ getters: true }),
    });
  } catch (err) {
    return next(err);
  }
};

export const updatePlace: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return generateError(next, 'Validating place inputs failed', 422);
  }
  const pId = req.params.pId;
  try {
    const place = await Place.findById(pId);
    if (!place) {
      return generateError(next, 'Place not found', 422);
    }
    if (place.creatorId.toString() !== req.userId) {
      return generateError(next, 'User did not post place', 401);
    }
    const { title, description } = req.body as {
      title: string;
      description: string;
    };
    place.title = title;
    place.description = description;
    const placeRes = await place.save();
    return res.status(200).json({
      message: 'Place Updated',
      place: placeRes,
    });
  } catch (err) {
    return next(err);
  }
};

export const deletePlace: RequestHandler = async (req, res, next) => {
  const pId = req.params.pId;
  try {
    const place = await Place.findById(pId);
    if (!place) {
      return generateError(next, 'Place not found', 422);
    }
    let user = await User.findById(req.userId);
    if (!user) {
      return generateError(next, 'User does not exist', 422);
    }

    if (place.creatorId.toString() !== user.id) {
      return generateError(next, 'User did not post place', 401);
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.delete({ session: sess });
    user.places.pull(place);
    await user.save({ session: sess });
    sess.commitTransaction();
    clearImage(place.imageURL);
    return res.status(200).json({
      message: 'Place Deleted',
      placeId: place.id,
    });
  } catch (err) {
    return next(err);
  }
};
