import useFormHook, { initialInputStructure } from '../../hooks/form-hook';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../util/validators';
import './NewPlace.css';

const NewPlace = () => {
  const {
    formState: { inputs, overallIsValid },
    inputHandler,
  } = useFormHook(
    {
      title: initialInputStructure,
      description: initialInputStructure,
      image: initialInputStructure,
      address: initialInputStructure,
    },
    false
  );

  const submitNewPlaceHandler: React.FormEventHandler<HTMLFormElement> = (
    e
  ) => {
    e.preventDefault();
    console.log(inputs);
  };

  return (
    <form className='place-form' onSubmit={submitNewPlaceHandler}>
      <Input
        element='input'
        type='text'
        id='title'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title!'
        onInput={inputHandler}
      />
      <Input
        element='textarea'
        id='description'
        label='Description'
        validators={[VALIDATOR_MINLENGTH(4)]}
        errorText='Please enter a valid description!'
        onInput={inputHandler}
      />
      <Input
        element='input'
        type='text'
        id='image'
        label='Image'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid image!'
        onInput={inputHandler}
      />
      <Input
        element='textarea'
        id='address'
        label='Address'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid address!'
        onInput={inputHandler}
      />
      <Button disabled={!overallIsValid}>Submit Form Data</Button>
    </form>
  );
};

export default NewPlace;
