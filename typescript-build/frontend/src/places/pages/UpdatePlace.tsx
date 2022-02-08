import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import useFormHook, { initialInputStructure } from '../../hooks/form-hook';
import useHttpHook from '../../hooks/http-hook';
import Place from '../../models/place';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import { RootState } from '../../store';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';

const UpdatePlace = () => {
  const navigate = useNavigate();
  const token = useSelector<RootState>((state) => state.auth.token) as string;
  const userId = useSelector<RootState>((state) => state.auth.userId) as string;
  const { isLoading, httpError, sendRequest, clearError } = useHttpHook();

  const [notFound, setNotFound] = useState(true);

  const { formState, inputHandler, setFormData } = useFormHook(
    {
      title: initialInputStructure,
      description: initialInputStructure,
    },
    true
  );

  const placeId = useParams().pid;
  useEffect(() => {
    const fetchPlace = async () => {
      setNotFound(true);
      try {
        const data = await sendRequest(
          `http://localhost:8000/feed/place/${placeId}`,
          'GET',
          undefined,
          { Authorization: 'Bearer ' + token }
        );
        const place = data.place as Place;
        setFormData({
          inputs: {
            title: {
              val: place.title,
              isValid: true,
            },
            description: {
              val: place.description,
              isValid: true,
            },
          },
          overallIsValid: true,
        });
        setNotFound(false);
      } catch (err) {}
    };
    fetchPlace().catch((err) => console.log(err));
  }, [placeId, setFormData, token, sendRequest]);

  const updateFormHandler: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    try {
      await sendRequest(
        `http://localhost:8000/feed/place/${placeId}`,
        'PUT',
        JSON.stringify({
          title: formState.inputs.title!.val,
          description: formState.inputs.description!.val,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        }
      );
      navigate(`/${userId}/places`, { replace: true });
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className='centered'>
        <Card>
          <h2>Loading...</h2>
        </Card>
      </div>
    );
  }

  const errorContent = (
    <div className='centered' onClick={clearError}>
      <Card>
        <h2>No Such Place Found!</h2>
      </Card>
    </div>
  );

  return (
    <>
      {(httpError || notFound) && errorContent}
      {!isLoading && !notFound && !httpError && (
        <form className='place-form' onSubmit={updateFormHandler}>
          <Input
            element='input'
            type='text'
            id='title'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title'
            onInput={inputHandler}
            initialValue={formState.inputs.title?.val as string}
            initialValidity={true}
          />
          <Input
            element='textarea'
            id='description'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(4)]}
            errorText='Please enter a valid description'
            onInput={inputHandler}
            initialValue={formState.inputs.description?.val as string}
            initialValidity={true}
          />
          <Button disabled={!formState.overallIsValid}>UPDATE PLACE</Button>
          <pre>{JSON.stringify(formState.inputs, null, 2)}</pre>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
