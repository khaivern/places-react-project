import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button/Button';
import Input from '../../shared/components/FormElements/Input/Input';
import Card from '../../shared/components/UIElements/Card/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import useForm from '../../shared/hooks/form-hook';
import useHttp from '../../shared/hooks/http-hook';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import AuthContext from '../../store/auth-context';

import './PlaceForm.css';

const UpdatePlace = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const placeId = useParams().placeId;

  const { formState, inputHandler, setData } = useForm({
    inputs: {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    overallForm: true,
  });

  const [place, setPlace] = useState();
  const { isLoading, error, sendRequest, resetError } = useHttp();

  useEffect(() => {
    sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`).then(
      (response) => {
        if (!response.error) {
          setPlace(response.place);
          setData(
            {
              title: {
                value: response.place.title,
                isValid: true,
              },
              description: {
                value: response.place.description,
                isValid: true,
              },
            },
            true
          );
        }
      }
    );
  }, [sendRequest, placeId, setData]);

  if (!isLoading && !place && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  const updatePlaceHandler = async (e) => {
    e.preventDefault();
    const response = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
      'PATCH',
      {
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      },
      {
        Authorization: 'Bearer ' + authCtx.token,
      }
    );
    if (!response.error) {
      navigate(`/${authCtx.userId}/places`);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={resetError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && place && (
        <form className='place-form' onSubmit={updatePlaceHandler}>
          <Input
            element='input'
            type='text'
            label='Title'
            id='title'
            errorText='Please enter a valid title'
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            initialValue={place.title}
            initialValidity={true}
          />
          <Input
            element='textarea'
            label='Description'
            id='description'
            errorText='Please enter a valid description of at least 5 chars'
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
            initialValue={place.description}
            initialValidity={true}
          />

          <Button type='submit' disabled={!formState.overallForm}>
            UPDATE PLACE
          </Button>
          <pre>{JSON.stringify(formState.inputs, null, 2)}</pre>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
