import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card/Card';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './Auth.css';
import { authActions } from '../../store/auth';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const { formState, inputHandler, setFormData } = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = event => {
    event.preventDefault();
    console.log(formState);
    dispatch(authActions.login());
  };
  const switchModeHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogin(prevState => !prevState);
  };

  return (
    <Card className='authentication'>
      <h2 className='authentication__header'>Login Required</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLogin && (
          <Input
            element='input'
            id='name'
            type='text'
            label='Name'
            errorText='Please enter a name'
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />
        )}
        <Input
          element='input'
          id='email'
          type='text'
          label='E-Mail'
          errorText='Please enter a valid E-Mail'
          validators={[VALIDATOR_EMAIL()]}
          onInput={inputHandler}
        />
        <Input
          element='input'
          id='password'
          type='password'
          label='Password'
          errorText='Please enter a valid password of at least 4 characters'
          validators={[VALIDATOR_MINLENGTH(4)]}
          onInput={inputHandler}
        />
        <Button type='submit' disabled={!formState.allInputsValid}>
          Login
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        Switch to {isLogin ? 'SIGNUP' : 'LOGIN'}
      </Button>
    </Card>
  );
};

export default Auth;
