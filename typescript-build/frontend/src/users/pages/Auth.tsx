import { useState } from 'react';
import useFormHook, { initialInputStructure } from '../../hooks/form-hook';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import { useAppDispatch } from '../../store';
import { authActions } from '../../store/auth';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './Auth.css';
import useHttpHook from '../../hooks/http-hook';
import ErrorForm from '../../shared/util/error-form';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Auth: React.FC = () => {
  const { isLoading, httpError, sendRequest, clearError } = useHttpHook();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const dispatch = useAppDispatch();
  const {
    formState: { inputs, overallIsValid },
    inputHandler,
    setFormData,
  } = useFormHook(
    {
      email: initialInputStructure,
      password: initialInputStructure,
    },
    false
  );

  const authFormHandler: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    let url: string;
    if (isLoginMode) {
      url = process.env.REACT_APP_BACKEND_URL + '/auth/login';
    } else {
      url = process.env.REACT_APP_BACKEND_URL + '/auth/signup';
    }

    const formData = new FormData();
    formData.append('email', inputs.email!.val as string);
    formData.append('password', inputs.password!.val as string);
    formData.append('image', inputs.image?.val as File);
    formData.append('name', inputs.name?.val as string);
    const data = await sendRequest(url, 'POST', formData);
    if (data && data.token && data.userId) {
      const expiration = new Date(new Date().getTime() + 1000 * 60 * 60);
      dispatch(
        authActions.login({
          token: data.token,
          userId: data.userId,
          expiration: expiration.toISOString(),
        })
      );
    } else {
      // optional: send sign up notification
      setIsLoginMode(true);
    }
  };

  const switchModeHandler = () => {
    if (isLoginMode) {
      // login -> signup
      setFormData({
        inputs: {
          ...inputs,
          name: {
            val: '',
            isValid: false,
          },
          image: {
            val: null,
            isValid: false,
          },
        },
        overallIsValid: false,
      });
    } else {
      // signup -> login
      setFormData({
        inputs: {
          ...inputs,
          name: null,
          image: null,
        },
        overallIsValid: inputs.email!.isValid && inputs.password!.isValid,
      });
    }

    setIsLoginMode((prevState) => !prevState);
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {httpError && <ErrorForm clearError={clearError} errorText={httpError} />}
      <Card className='authentication'>
        <header className='authentication__header'>
          <h1>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</h1>
        </header>
        <hr />
        <form onSubmit={authFormHandler}>
          {!isLoginMode && (
            <Input
              element='input'
              type='text'
              id='name'
              label='Name'
              onInput={inputHandler}
              errorText='Please enter a valid name'
              validators={[VALIDATOR_REQUIRE()]}
            />
          )}
          {!isLoginMode && (
            <ImageUpload id='image' center onInput={inputHandler} authForm />
          )}
          <Input
            element='input'
            type='email'
            id='email'
            label='E-mail'
            onInput={inputHandler}
            errorText='Please enter a valid email'
            validators={[VALIDATOR_EMAIL()]}
          />
          <Input
            element='input'
            type='password'
            id='password'
            label='Password'
            onInput={inputHandler}
            errorText='Please enter a valid password of at least 4 characters'
            validators={[VALIDATOR_MINLENGTH(4)]}
          />
          <Button disabled={!overallIsValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch to {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
