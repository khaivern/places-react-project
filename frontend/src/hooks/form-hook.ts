import { useCallback, useReducer } from 'react';

export const initialInputStructure = {
  val: '',
  isValid: false,
};
interface initialFormI {
  inputs: {
    [id: string]: {
      val: string;
      isValid: boolean;
    } | null;
  };
  overallIsValid: boolean;
}

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
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.id) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId]!.isValid;
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

const useFormHook = (
  initialFormInputs: initialFormI['inputs'],
  initialFormValidity: boolean
) => {
  const [formState, dispatchFormAction] = useReducer(formReducer, {
    inputs: initialFormInputs,
    overallIsValid: initialFormValidity,
  });

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
