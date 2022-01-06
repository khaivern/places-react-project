import { useReducer, useCallback } from 'react';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../util/validators';
import './NewPlace.css';

const initialInputString = {
  value: '',
  isValid: false,
};

interface initialFormI {
  inputs: { [id: string]: { value: string; isValid: boolean } };
  overallIsValid: boolean;
}

const initialForm: initialFormI = {
  inputs: {
    title: initialInputString,
    description: initialInputString,
    address: initialInputString,
    image: initialInputString,
  },
  overallIsValid: false,
};

interface FormActionChange {
  type: 'FORM_INPUT_HANDLER';
  id: string;
  val: string;
  isValid: boolean;
}

type Action = FormActionChange;

const formReducer = (state = initialForm, action: Action) => {
  switch (action.type) {
    case 'FORM_INPUT_HANDLER':
      let overallFormValidity = true;
      for (const inputId in state.inputs) {
        if (inputId === action.id) {
          overallFormValidity = overallFormValidity && action.isValid;
        } else {
          const currentInputId = state.inputs[inputId];
          overallFormValidity = overallFormValidity && currentInputId.isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.id]: {
            value: action.val,
            isValid: action.isValid,
          },
        },
        overallIsValid: overallFormValidity,
      };
    default:
      return state;
  }
};

const NewPlace = () => {
  const [{ inputs, overallIsValid }, dispatchFormAction] = useReducer(
    formReducer,
    initialForm
  );

  const inputHandler = useCallback(
    (id: string, value: string, isValid: boolean) => {
      dispatchFormAction({
        type: 'FORM_INPUT_HANDLER',
        id: id,
        val: value,
        isValid: isValid,
      });
    },
    []
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
