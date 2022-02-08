import React from 'react';
import Button from '../../shared/components/FormElements/Button/Button';
import Card from '../../shared/components/UIElements/Card/Card';
import PlaceItem from './PlaceItem';

import './PlaceList.css';
const PlaceList = ({ items, onDeletePlace }) => {
  if (items.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          <h2>No Places Found. Maybe Create one?</h2>
          <Button to='/places/new'>Share Place</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className='place-list'>
      {items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDeletePlace={onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
