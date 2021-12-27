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
import { authActions } from '../../store/auth';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/Spinner/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Auth.css';
import ImageUpload from '../../places/components/ImageUpload';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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

  const authSubmitHandler = async event => {
    event.preventDefault();
    console.log(formState.inputs);
    if (isLogin) {
      try {
        const data = await sendRequest(
          'http://localhost:5000/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );
        dispatch(authActions.login(data.user.id));
      } catch (error) {}
    } else {
      try {
        const data = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            'Content-Type': 'application/json',
          }
        );

        dispatch(authActions.login(data.user.id));
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
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
          image: {
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
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className='authentication__header'>
          {isLogin ? 'LOGIN' : 'SIGNUP'} Required
        </h2>
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
          {!isLogin && (
            <ImageUpload
              id='image'
              center
              errorText='Image selected cannot be parsed'
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
            {isLogin ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch to {isLogin ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
