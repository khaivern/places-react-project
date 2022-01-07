import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFormHook from '../../hooks/form-hook';
import Place from '../../models/place';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../util/validators';

const DUMMY_PLACES = [
  new Place(
    'p1',
    'https://i.picsum.photos/id/465/200/200.jpg?hmac=66oxx-Qv8Bakk-7zPy6Kdv7t064QKKWhmDwQTWGZ7A0',
    'Lovely Place',
    'One of the most famous sights',
    '101, Jalan Radin Bagus, Bandar Baru Sri Petaling, 57000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur',
    'u1',
    {
      lat: 2.2438807,
      lng: 101.5358377,
    }
  ),
  new Place(
    'p2',
    'https://i.picsum.photos/id/64/200/200.jpg?hmac=lJVbDn4h2axxkM72s1w8X1nQxUS3y7li49cyg0tQBZU',
    'Jeff Fat Food Place',
    'Famous Eatery for really fat people',
    'Lot No. A-013, A-013A, A017A Dataran Pahlawan Melaka Megamall, Jln Merdeka, Bandar Hilir, 75000, Melaka',
    'u2',
    {
      lat: 2.1903465,
      lng: 102.2318508,
    }
  ),
];

const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { formState, inputHandler, setFormData } = useFormHook();
  const placeId = useParams().pid;
  useEffect(() => {
    const place = DUMMY_PLACES.find((place) => place.id === placeId);
    setIsLoading(true);
    if (!place) {
      throw new Error('Found no such place');
    }
    setFormData({
      inputs: {
        title: {
          val: place.title,
          isValid: true,
        },
        description: {
          val: place.description,
          isValid: true,
        },
      },
      overallIsValid: true,
    });
    setIsLoading(false);
  }, [placeId, setFormData]);

  const updateFormHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(formState);
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
    <form className='place-form' onSubmit={updateFormHandler}>
      <Input
        element='input'
        type='text'
        id='title'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title'
        onInput={inputHandler}
        initialValue={formState.inputs.title.val}
        initialValidity={true}
      />
      <Input
        element='textarea'
        id='description'
        label='Description'
        validators={[VALIDATOR_MINLENGTH(4)]}
        errorText='Please enter a valid description'
        onInput={inputHandler}
        initialValue={formState.inputs.description.val}
        initialValidity={true}
      />
      <Button disabled={!formState.overallIsValid}>UPDATE PLACE</Button>
    </form>
  );
};

export default UpdatePlace;
