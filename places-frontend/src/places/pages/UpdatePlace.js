import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card/Card';
import { useForm } from '../../shared/hooks/form-hook';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './PlaceForm.css';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: "YOUR MOM'S HOUSE",
    address: 'Free Trade Zone Batu Berendam, Batu Berendam, 75350 Malacca',
    description: 'One of the most visited places by a lot of giga chads',
    imageUrl:
      'https://i.picsum.photos/id/308/200/300.jpg?hmac=gixbOWHWb-aG6q4H8cIfry9U7rYooifzOLag_k5v-tk',
    location: {
      lat: 40.748,
      lng: -73.987,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Perry the platypus',
    address: 'Taman Perindustrian Batu Berendam, 75350 Malacca',
    description: 'the detective perry, blue and soy',
    imageUrl:
      'https://i.picsum.photos/id/404/200/300.jpg?hmac=1i6ra6DJN9kJ9AQVfSf3VD1w08FkegBgXuz9lNDk1OM',
    location: {
      lat: 2.2401141,
      lng: 102.2891321,
    },
    creator: 'u2',
  },
];

const UpdatePlace = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { formState, inputHandler, setFormData } = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find(
    place => place.id === params.placeId
  );

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedPlace]);
  if (!identifiedPlace) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState);
  };

  if (isLoading) {
    return (
      <div className='center'>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form onSubmit={placeUpdateSubmitHandler} className='place-form'>
      <Input
        element='input'
        id='title'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid Title'
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        element='textarea'
        id='description'
        label='Description'
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText='Please enter a valid description of at least 5 characters'
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type='submit' disabled={!formState.allInputsValid}>
        Update Place
      </Button>
    </form>
  );
};

export default UpdatePlace;
