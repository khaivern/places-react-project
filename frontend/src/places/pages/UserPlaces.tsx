import React from 'react';
import { useParams } from 'react-router-dom';
import Place from '../../models/place';
import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  new Place(
    'https://i.picsum.photos/id/465/200/200.jpg?hmac=66oxx-Qv8Bakk-7zPy6Kdv7t064QKKWhmDwQTWGZ7A0',
    'Lovely Place',
    'One of the most famous sights',
    '101, Jalan Radin Bagus, Bandar Baru Sri Petaling, 57000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur',
    'u1',
    {
      lat: 2.2438807,
      lng: 101.5358377,
    }
  ),
  new Place(
    'https://i.picsum.photos/id/64/200/200.jpg?hmac=lJVbDn4h2axxkM72s1w8X1nQxUS3y7li49cyg0tQBZU',
    'Jeff Fat Food Place',
    'Famous Eatery for really fat people',
    'Lot No. A-013, A-013A, A017A Dataran Pahlawan Melaka Megamall, Jln Merdeka, Bandar Hilir, 75000, Melaka',
    'u2',
    {
      lat: 2.1903465,
      lng: 102.2318508,
    }
  ),
];

const UserPlaces = () => {
  const userId = useParams().uid;
  const loadedPlaces = DUMMY_PLACES.filter(
    (place) => place.creatorId === userId
  );
  return <PlaceList items={loadedPlaces}></PlaceList>;
};

export default UserPlaces;
