import React, { useContext, useState } from 'react';
import Button from '../../shared/components/FormElements/Button/Button';
import Card from '../../shared/components/UIElements/Card/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import Map from '../../shared/components/UIElements/Map/Map';
import Modal from '../../shared/components/UIElements/Modal/Modal';
import useHttp from '../../shared/hooks/http-hook';
import AuthContext from '../../store/auth-context';
import './PlaceItem.css';

const PlaceItem = (props) => {
  const authCtx = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const cancelDeleteHandler = () => setShowDelete(false);
  const showDeleteHandler = () => setShowDelete(true);

  const { isLoading, error, sendRequest, resetError } = useHttp();
  const deletePlaceHandler = async () => {
    cancelDeleteHandler();
    const response = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
      'DELETE',
      null,
      {
        Authorization: 'Bearer ' + authCtx.token,
      }
    );

    if (!response.error) {
      props.onDeletePlace(response.place.id);
    }
  };
  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={props.coordinates} zoom={16}></Map>
        </div>
      </Modal>
      <Modal
        show={showDelete}
        onCancel={cancelDeleteHandler}
        header='Are you sure?'
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={
          <>
            <Button onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={deletePlaceHandler}>
              CONFIRM
            </Button>
          </>
        }
      >
        <p>Once deleted, changes cannot be undone.</p>
      </Modal>
      <ErrorModal error={error} onClear={resetError} />
      <li className='place-item'>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='place-item__image'>
            <img src={props.image} alt={props.title} />
          </div>
          <div className='place-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {authCtx.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {authCtx.userId === props.creatorId && (
              <Button danger onClick={showDeleteHandler}>
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
