import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import Button from '../../shared/components/FormElements/Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const imageRef = useRef();
  const pickImageHandler = () => {
    imageRef.current.click();
  };
  const pickedHandler = event => {
    let pickedFile;
    let fileIsValid = isValid;
    setIsTouched(true);
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  return (
    <div className='form-control'>
      <input
        type='file'
        id={props.id}
        style={{ display: 'none' }}
        accept='.jpg,.png,.jpeg'
        ref={imageRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload__preview'>
          {previewUrl && <img src={previewUrl} alt='Preview' />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type='button' onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>
      {!isValid && isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
