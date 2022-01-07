import { useState } from 'react';
import useFormHook, { initialInputStructure } from '../../hooks/form-hook';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import { useAppDispatch } from '../../store';
import { authActions } from '../../store/auth';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../util/validators';
import './Auth.css';

const Auth: React.FC = () => {
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

  const authFormHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(authActions.login());
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
        },
        overallIsValid: false,
      });
    } else {
      // signup -> login
      setFormData({
        inputs: {
          ...inputs,
          name: null,
        },
        overallIsValid: inputs.email!.isValid && inputs.password!.isValid,
      });
    }

    setIsLoginMode((prevState) => !prevState);
  };
  return (
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

      <pre>{JSON.stringify(inputs, null, 2)}</pre>
    </Card>
  );
};

export default Auth;
