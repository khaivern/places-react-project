import React, { useContext } from 'react';
import Input from '../../shared/components/FormElements/Input/Input';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button/Button';
import './PlaceForm.css';
import useForm from '../../shared/hooks/form-hook';
import useHttp from '../../shared/hooks/http-hook';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload';

const NewPlace = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { formState, inputHandler } = useForm({
    inputs: {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    overallForm: false,
  });

  const { isLoading, error, sendRequest, resetError } = useHttp();
  const submitPlaceHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      const response = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/places',
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + authCtx.token,
        }
      );
      // Success Case
      if (!response.error) {
        navigate(`/${authCtx.userId}/places`);
      }
    } catch (err) {}
  };
  return (
    <>
      <ErrorModal onClear={resetError} error={error} />
      <form className='place-form' onSubmit={submitPlaceHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          element='input'
          label='Title'
          id='title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid title'
          onInput={inputHandler}
        />
        <Input
          element='textarea'
          label='Description'
          id='description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a valid description of 5 chars at least'
          onInput={inputHandler}
        />
        <Input
          element='input'
          label='Address'
          id='address'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid address'
          onInput={inputHandler}
        />
        <ImageUpload
          id='image'
          onInput={inputHandler}
          errorText='Please enter a valid image'
        />
        <Button type='submit' disabled={!formState.overallForm}>
          ADD PLACE
        </Button>
        <pre style={{ textAlign: 'left' }}>
          {JSON.stringify(formState.inputs, null, 2)}
        </pre>
      </form>
    </>
  );
};

export default NewPlace;
