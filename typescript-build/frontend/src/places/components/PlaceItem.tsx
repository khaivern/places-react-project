import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useHttpHook from '../../hooks/http-hook';
import Place from '../../models/place';
import ErrorForm from '../../shared/util/error-form';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Map from '../../shared/components/UIElements/Map';
import Modal from '../../shared/components/UIElements/Modal';
import { RootState } from '../../store';

import './PlaceItem.css';

interface PlaceItemProps extends Place {
  onDeletePlace: () => void;
}

const PlaceItem: React.FC<PlaceItemProps> = ({
  id,
  address,
  description,
  imageURL,
  title,
  coordinates,
  onDeletePlace,
  creatorId,
}) => {
  const token = useSelector<RootState>((state) => state.auth.token) as string;
  const userId = useSelector<RootState>((state) => state.auth.userId) as string;
  const [showMap, setShowMap] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const showWarningModal = () => setShowWarning(true);
  const closeWarningModal = () => setShowWarning(false);

  const { isLoading, httpError, sendRequest, clearError } = useHttpHook();

  const confirmDeleteHandler: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    if (userId !== creatorId) {
      closeWarningModal();
      return;
    }
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/feed/place/${id}`,
        'DELETE',
        undefined,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      onDeletePlace();
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className='centered'>
        <Card>
          <h2>Loading...</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      {httpError && <ErrorForm clearError={clearError} errorText={httpError} />}
      <Modal
        onCancel={closeMapHandler}
        show={showMap}
        header={address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        onCancel={closeWarningModal}
        show={showWarning}
        header='ARE YOU SURE?'
        onSubmit={confirmDeleteHandler}
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
            <img src={`${process.env.REACT_APP_BACKEND_URL}/images/${imageURL}`} alt={title} />
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
            {creatorId === userId && <Button to={`/places/${id}`}>EDIT</Button>}
            {creatorId === userId && (
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
