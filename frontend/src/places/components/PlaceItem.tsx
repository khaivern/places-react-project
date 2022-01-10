import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Place from '../../models/place';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Map from '../../shared/components/UIElements/Map';
import Modal from '../../shared/components/UIElements/Modal';
import { RootState } from '../../store';

import './PlaceItem.css';

const PlaceItem: React.FC<Place> = ({
  id,
  address,
  description,
  image,
  title,
  location,
}) => {
  const token = useSelector<RootState>((state) => state.auth.token);

  const [showMap, setShowMap] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const showWarningModal = () => setShowWarning(true);
  const closeWarningModal = () => setShowWarning(false);

  const deletePlaceHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log('DELETED PLACE');
    closeWarningModal();
  };
  return (
    <>
      <Modal
        onCancel={closeMapHandler}
        show={showMap}
        header={address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={location} zoom={16} />
        </div>
      </Modal>
      <Modal
        onCancel={closeWarningModal}
        show={showWarning}
        header='ARE YOU SURE?'
        onSubmit={deletePlaceHandler}
        footer={
          <>
            <Button inverse type='button' onClick={closeWarningModal}>
              CANCEL
            </Button>
            <Button danger>CONFIRM</Button>
          </>
        }
      >
        <p>Once deleted, changes can never be undone.</p>
      </Modal>
      <li className='place-item'>
        <Card className='place-item__content'>
          <div className='place-item__image'>
            <img src={image} alt={title} />
          </div>
          <div className='place-item__info'>
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {token && <Button to={`/places/${id}`}>EDIT</Button>}
            {token && (
              <Button onClick={showWarningModal} danger>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
