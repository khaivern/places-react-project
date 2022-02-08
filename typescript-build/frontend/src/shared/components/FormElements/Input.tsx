import React, { useEffect, useReducer } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

interface InputProps {
  element: string;
  id: string;
  rows?: number;
  type?: string;
  label: string;
  validators: { type: string; val?: number }[];
  errorText: string;
  onInput: (id: string, value: string, isValid: boolean) => void;
  initialValue?: string;
  initialValidity?: boolean;
  style?: React.CSSProperties;
}

interface InputStateI {
  value: string;
  isValid: boolean;
  isTouched: boolean;
}

interface InputActionChange {
  type: 'CHANGE';
  val: string;
  validators: { type: string; val?: number }[];
}

interface InputActionBlur {
  type: 'BLUR';
}

type InputAction = InputActionChange | InputActionBlur;

const inputReducer = (state: InputStateI, action: InputAction) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'BLUR':
      return { ...state, isTouched: true };
    default:
      return state;
  }
};

const Input: React.FC<InputProps> = ({
  element,
  type,
  id,
  rows,
  label,
  validators,
  errorText,
  onInput,
  initialValue,
  initialValidity,
  style,
}) => {
  const [{ value, isValid, isTouched }, dispatchInputAction] = useReducer(
    inputReducer,
    {
      value: initialValue || '',
      isValid: initialValidity || false,
      isTouched: false,
    }
  );

  useEffect(() => {
    onInput(id, value, isValid);
  }, [onInput, id, value, isValid]);

  const inputChangeHandler: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    dispatchInputAction({
      type: 'CHANGE',
      val: e.target.value,
      validators: validators,
    });
  };

  const inputBlurHandler = () => {
    dispatchInputAction({ type: 'BLUR' });
  };

  const content =
    element === 'input' ? (
      <input
        type={type || 'text'}
        id={id}
        onChange={inputChangeHandler}
        onBlur={inputBlurHandler}
        value={value}
        style={style}
      />
    ) : (
      <textarea
        id={id}
        rows={rows || 3}
        onChange={inputChangeHandler}
        onBlur={inputBlurHandler}
        value={value}
      />
    );

  const hasError = isTouched && !isValid;

  return (
    <div className={`form-control ${hasError ? 'form-control--invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {content}
      {hasError && <p>{errorText}</p>}
    </div>
  );
};

export default Input;
