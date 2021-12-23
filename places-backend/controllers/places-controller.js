const HttpError = require('../models/http-error');
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../util/location');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: "YOUR MOM'S HOUSE",
    address: 'Free Trade Zone Batu Berendam, Batu Berendam, 75350 Malacca',
    description: 'One of the most visited places by a lot of giga chads',
    imageUrl:
      'https://i.picsum.photos/id/308/200/300.jpg?hmac=gixbOWHWb-aG6q4H8cIfry9U7rYooifzOLag_k5v-tk',
    location: {
      lat: 40.748,
      lng: -73.987,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Perry the platypus',
    address: 'Taman Perindustrian Batu Berendam, 75350 Malacca',
    description: 'the detective perry, blue and soy',
    imageUrl:
      'https://i.picsum.photos/id/404/200/300.jpg?hmac=1i6ra6DJN9kJ9AQVfSf3VD1w08FkegBgXuz9lNDk1OM',
    location: {
      lat: 2.2401141,
      lng: 102.2891321,
    },
    creator: 'u1',
  },
];

exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place) {
    const error = new HttpError(
      'Could not find place for the provided ID',
      404
    );
    throw error;
  }

  res.json({ place });
};

exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter(place => place.creator === userId);
  if (!places || places.length === 0) {
    const error = new HttpError(
      'Could not find place for the provided user ID',
      404
    );
    return next(error);
  }
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
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({
    message: 'Place Created Successfully',
    place: createdPlace,
  });
};

exports.updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Validation Failed', 422);
  }
  const pid = req.params.pid;
  const { title, description } = req.body;
  const updatedPlace = { ...DUMMY_PLACES.find(place => place.id === pid) };
  const existingPlaceIndex = DUMMY_PLACES.findIndex(place => place.id === pid);
  if (existingPlaceIndex === -1) {
    const error = new HttpError('Place not found', 404);
    throw error;
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[existingPlaceIndex] = updatedPlace;

  res.status(200).json({
    message: 'Updated Successfully',
    place: updatedPlace,
  });
};

exports.deletePlace = (req, res, next) => {
  const pid = req.params.pid;
  if (!DUMMY_PLACES.find(place => place.id === pid)) {
    throw new HttpError('Could not find place', 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== pid);

  res.status(200).json({
    message: 'Deleted place',
  });
};
