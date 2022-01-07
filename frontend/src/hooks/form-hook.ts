import { useCallback, useReducer } from 'react';

interface initialFormI {
  inputs: {
    [id: string]: {
      val: string;
      isValid: boolean;
    };
  };
  overallIsValid: boolean;
}

const initialInputData = {
  val: '',
  isValid: false,
};

const initialForm: initialFormI = {
  inputs: {
    title: initialInputData,
    description: initialInputData,
    address: initialInputData,
    image: initialInputData,
  },
  overallIsValid: false,
};

interface onInputAction {
  type: 'CHANGE';
  id: string;
  value: string;
  isValid: boolean;
}

interface setDataAction {
  type: 'SET_DATA';
  formStateData: initialFormI;
}

type Action = onInputAction | setDataAction;

const formReducer = (state: initialFormI, action: Action) => {
  switch (action.type) {
    case 'CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
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
            val: action.value,
            isValid: action.isValid,
          },
        },
        overallIsValid: formIsValid,
      };
    case 'SET_DATA':
      return {
        ...action.formStateData,
      };
    default:
      return state;
  }
};

const useFormHook = () => {
  const [formState, dispatchFormAction] = useReducer(formReducer, initialForm);

  const inputHandler = useCallback(
    (id: string, value: string, isValid: boolean) => {
      dispatchFormAction({ type: 'CHANGE', id, value, isValid });
    },
    []
  );

  const setFormData = useCallback((formStateData: initialFormI) => {
    dispatchFormAction({ type: 'SET_DATA', formStateData });
  }, []);

  return { formState, inputHandler, setFormData };
};

export default useFormHook;
