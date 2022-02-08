import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.id) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
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
        overallForm: formIsValid,
      };
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        overallForm: action.overallForm,
      };
    default:
      return state;
  }
};

const useForm = initialValue => {
  const [formState, dispatchFormAction] = useReducer(formReducer, initialValue);
  const inputHandler = useCallback((id, value, isValid) => {
    dispatchFormAction({
      type: 'INPUT_CHANGE',
      id: id,
      val: value,
      isValid: isValid,
    });
  }, []);

  const setData = useCallback((inputs, overallForm) => {
    dispatchFormAction({
      type: 'SET_DATA',
      inputs: inputs,
      overallForm: overallForm,
    });
  }, []);

  return {
    formState,
    inputHandler,
    setData,
  };
};

export default useForm;
