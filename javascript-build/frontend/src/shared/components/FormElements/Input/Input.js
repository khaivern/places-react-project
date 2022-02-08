import React, { useReducer, useEffect } from 'react';

import { validate } from '../../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCHED':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatchInputAction] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isValid: props.initialValidity || false,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInput(id, value, isValid);
  }, [onInput, id, value, isValid]);

  const changeHandler = (e) => {
    dispatchInputAction({
      type: 'CHANGE',
      val: e.target.value,
      validators: props.validators,
    });
  };

  const blurHandler = () => {
    dispatchInputAction({
      type: 'TOUCHED',
    });
  };

  const element =
    props.element === 'input' ? (
      <input
        type={props.type}
        id={props.id}
        onChange={changeHandler}
        onBlur={blurHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || '3'}
        onChange={changeHandler}
        onBlur={blurHandler}
        value={inputState.value}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && 'form-control--invalid'
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
