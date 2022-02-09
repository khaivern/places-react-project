import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFormHook, { initialInputStructure } from '../../hooks/form-hook';
import useHttpHook from '../../hooks/http-hook';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Input from '../../shared/components/FormElements/Input';

import { RootState } from '../../store';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import './NewPlace.css';
import ErrorForm from '../../shared/util/error-form';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const NewPlace = () => {
  const token = useSelector<RootState>((state) => state.auth.token);
  const userId = useSelector<RootState>((state) => state.auth.userId);

  const navigate = useNavigate();
  const { isLoading, sendRequest, httpError, clearError } = useHttpHook();
  const {
    formState: { inputs, overallIsValid },
    inputHandler,
  } = useFormHook(
    {
      title: initialInputStructure,
      description: initialInputStructure,
      image: {
        val: null,
        isValid: false,
      },
      address: initialInputStructure,
    },
    false
  );

  const submitNewPlaceHandler: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    const { title, image, address, description } = inputs as {
      title: typeof initialInputStructure;
      description: typeof initialInputStructure;
      image: {
        val: File;
        isValid: boolean;
      };
      address: typeof initialInputStructure;
    };
    const formData = new FormData();
    formData.append('title', title.val);
    formData.append('image', image.val);
    formData.append('address', address.val);
    formData.append('description', description.val);

    try {
      const data = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/feed/place',
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + token,
        }
      );
      if (data.error) {
        console.log(httpError);

        return;
      }
      navigate(`/${userId}/places`);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className='centered'>
        <Card>
          <LoadingSpinner />
        </Card>
      </div>
    );
  }

  return (
    <>
      {httpError && <ErrorForm errorText={httpError} clearError={clearError} />}

      <form className='place-form' onSubmit={submitNewPlaceHandler}>
        <Input
          element='input'
          type='text'
          id='title'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid title!'
          onInput={inputHandler}
        />
        <Input
          element='textarea'
          id='description'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(4)]}
          errorText='Please enter a valid description!'
          onInput={inputHandler}
        />
        <ImageUpload id='image' onInput={inputHandler} placeForm />
        <Input
          element='textarea'
          id='address'
          label='Address'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid address!'
          onInput={inputHandler}
        />
        <Button disabled={!overallIsValid}>Submit Form Data</Button>
        <pre>{JSON.stringify(inputs, null, 2)}</pre>
      </form>
    </>
  );
};

export default NewPlace;
