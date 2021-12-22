import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        allInputsValid: formIsValid,
      };
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        allInputsValid: action.formIsValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const initalForm = {
    inputs: initialInputs,
    allInputsValid: initialFormValidity,
  };
  const [formState, dispatchFormState] = useReducer(formReducer, initalForm);
  const inputHandler = useCallback((id, value, isValid) => {
    dispatchFormState({ type: 'INPUT_CHANGE', inputId: id, value, isValid });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatchFormState({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return { formState, inputHandler, setFormData };
};
