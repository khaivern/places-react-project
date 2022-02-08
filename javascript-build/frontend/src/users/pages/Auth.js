import React, { useContext, useState } from 'react';

import Button from '../../shared/components/FormElements/Button/Button';
import Input from '../../shared/components/FormElements/Input/Input';
import Card from '../../shared/components/UIElements/Card/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';
import useForm from '../../shared/hooks/form-hook';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import AuthContext from '../../store/auth-context';

import './Auth.css';
import useHttp from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload/ImageUpload';
const Auth = () => {
  const authCtx = useContext(AuthContext);
  const { formState, inputHandler, setData } = useForm({
    inputs: {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    overallForm: false,
  });

  const [isLogin, setIsLogin] = useState(true);

  const { isLoading, error, sendRequest, resetError } = useHttp();

  const submitAuthHandler = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/login',
          'POST',
          {
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }
        );

        if (!response.error)
          authCtx.login(response.user.id, response.user.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('image', formState.inputs.image.value);
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/signup',
          'POST',
          formData
        );

        if (!response.error)
          authCtx.login(response.user.id, response.user.token);
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    if (isLogin) {
      setData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    } else {
      setData(
        {
          ...formState.inputs,
          name: null,
          image: null,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
    setIsLogin((curr) => !curr);
  };

  return (
    <>
      <ErrorModal onClear={resetError} error={error} />
      <Card className='authentication'>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2 className='authentication__header'>
          {!isLogin ? 'SIGNUP' : 'LOGIN'}
        </h2>
        <hr />
        <form onSubmit={submitAuthHandler} className='place-form'>
          {!isLogin && (
            <Input
              element='input'
              type='text'
              label='Name'
              id='name'
              errorText='Please enter a valid name'
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
          )}
          {!isLogin && (
            <ImageUpload
              id='image'
              center
              onInput={inputHandler}
              errorText='Please enter a valid image'
            />
          )}
          <Input
            element='input'
            type='email'
            label='Email'
            id='email'
            errorText='Please enter a valid email'
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />
          <Input
            element='input'
            type='password'
            label='Password'
            id='password'
            errorText='Please enter a valid password of at least 4 chars'
            validators={[VALIDATOR_MINLENGTH(4)]}
            onInput={inputHandler}
          />
          <Button type='submit' disabled={!formState.overallForm}>
            {!isLogin ? 'SIGNUP' : 'LOGIN'}
          </Button>
        </form>
        <Button inverse type='button' onClick={switchModeHandler}>
          SWITCH MODE TO {isLogin ? 'SIGNUP' : 'LOGIN'}
        </Button>
        <pre style={{ textAlign: 'left' }}>
          {JSON.stringify(formState.inputs, null, 2)}
        </pre>
      </Card>
    </>
  );
};

export default Auth;
