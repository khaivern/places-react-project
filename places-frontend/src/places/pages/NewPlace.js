import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './PlaceForm.css';
import { useForm } from '../../shared/hooks/form-hook';

const NewPlace = () => {
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
      address: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = event => {
    event.preventDefault();
    console.log(formState);
  };
  return (
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
  );
};

export default NewPlace;
