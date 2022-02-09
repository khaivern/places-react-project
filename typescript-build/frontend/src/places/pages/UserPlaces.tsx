import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Place from '../../models/place';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useParams().uid;
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/feed/places/${userId}`
      );
      const data = await res.json();
      if (res.status !== 200) {
        throw new Error(data.message);
      }
      setLoadedPlaces(data.places);
      setIsLoading(false);
    };
    fetchUsers().catch((err) => console.log(err));
  }, [userId]);

  const deletePlaceHandler = (placeId: string) => {
    setLoadedPlaces((prevState) =>
      prevState.filter((place) => place.id !== placeId)
    );
  };

  if (isLoading) {
    return (
      <div className='centered'>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  return (
    <PlaceList
      items={loadedPlaces}
      onDeletePlace={deletePlaceHandler}
      userId={userId!}
    ></PlaceList>
  );
};

export default UserPlaces;
