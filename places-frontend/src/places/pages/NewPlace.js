import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/Spinner/LoadingSpinner';
import './PlaceForm.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

const NewPlace = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
  const userId = useSelector(state => state.userId);
  const token = useSelector(state => state.token);
  const { formState, inputHandler } = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      formData.append('creator', userId);

      await sendRequest('http://localhost:5000/api/places/', 'POST', formData, {
        Authorization: 'Bearer ' + token,
      });
      // Redirect to home page
      navigate('/', { replace: true });
    } catch (err) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <form onSubmit={placeSubmitHandler} className='place-form'>
        <Input
          element='input'
          id='title'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid Title'
          onInput={inputHandler}
        />
        <Input
          element='textarea'
          id='description'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a description of at least 5 characters'
          onInput={inputHandler}
        />
        <ImageUpload
          id='image'
          onInput={inputHandler}
          errorText='Please enter a valid image'
          center
        />
        <Input
          element='input'
          id='address'
          type='text'
          label='Address'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid address'
          onInput={inputHandler}
        />
        <Button type='submit' disabled={!formState.allInputsValid}>
          Add Place
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
