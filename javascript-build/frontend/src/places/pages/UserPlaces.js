import React, { useEffect, useState } from 'react';
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';
import useHttp from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';

const UserPlaces = () => {
  const userId = useParams().userId;
  const [places, setPlaces] = useState([]);
  const { isLoading, error, sendRequest, resetError } = useHttp();
  useEffect(() => {
    sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
    ).then((response) => setPlaces(response.places));
  }, [sendRequest, userId]);

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  const placeDeletedHandler = (id) => {
    setPlaces((curr) => curr.filter((place) => place.id !== id));
  };

  return (
    <>
      <ErrorModal error={error} onClear={resetError} />
      {!isLoading && places && (
        <PlaceList items={places} onDeletePlace={placeDeletedHandler} />
      )}
    </>
  );
};

export default UserPlaces;
