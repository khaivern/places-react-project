import mongoose from 'mongoose';
import { RequestHandler } from 'express';
import Place from '../models/Place';
import { generateError } from '../util/has-error';
import { getLocation } from '../util/get-location';
import User from '../models/User';
import HttpError from '../models/http-error';

export const createPlace: RequestHandler = async (req, res, next) => {
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
    imageURL: req.file.path.replace('\\', '/'),
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
  } catch (err) {}
};
