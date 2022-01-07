import React from 'react';
import Place from '../../models/place';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';

import './PlaceList.css';

const PlaceList: React.FC<{ items: Place[] }> = ({ items }) => {
  if (items && items.length === 0) {
    return (
      <div className='place-list centered'>
        <Card>
          <h2>No Places Found. Maybe create one?</h2>
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
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creatorId}
          location={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
