import React, { useEffect, useReducer } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default: {
      return state;
    }
  }
};

const Input = props => {
  const initialInput = {
    value: props.initialValue || '',
    isValid: props.initialValid || null,
    isTouched: false,
  };
  const [inputState, dispatchInputState] = useReducer(
    inputReducer,
    initialInput
  );
  const { value, isValid } = inputState;
  const { id, onInput } = props;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [onInput, id, value, isValid]);

  const changeHandler = event => {
    dispatchInputState({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
    });
  };

  const blurHandler = () => {
    dispatchInputState({
      type: 'TOUCH',
    });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
    );

  const hasError = !inputState.isValid && inputState.isTouched;

  return (
    <div className={`form-control ${hasError && 'form-control--invalid'}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {hasError && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
