import React, { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';

import './ImageUpload.css';
const ImageUpload = (props) => {
  const filePickedRef = useRef();

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }, [file]);

  const pickImageHandler = () => {
    filePickedRef.current.click();
  };

  const pickHandler = (event) => {
    let pickedFile;
    let fileIsValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      fileIsValid = true;
      setIsValid(true);
    } else {
      fileIsValid = false;
      setIsValid(false);
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <div className='form-control'>
      <input
        ref={filePickedRef}
        type='file'
        style={{ display: 'none' }}
        id={props.id}
        accept='.jpg,.png,.jpeg'
        onChange={pickHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload__preview'>
          {previewUrl && <img src={previewUrl} alt='Preview' />}
          {!previewUrl && <p>Pick an image</p>}
        </div>
        <Button type='button' onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>
      {file && !isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
