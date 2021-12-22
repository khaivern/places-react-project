import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
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
    creator: 'u2',
  },
];

const UserPlaces = () => {
  const params = useParams();

  const loadedPlaces = DUMMY_PLACES.filter(
    place => place.creator === params.userId
  );
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
