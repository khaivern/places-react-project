import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import './ImageUpload.css';
interface ImageUploadProps {
  id: string;
  center?: boolean;
  authForm?: boolean;
  placeForm?: boolean;
  onInput: (id: string, value: File | null, isValid: boolean) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  onInput,
  center,
  authForm,
  placeForm,
}) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [preview, setPreview] = useState<string | undefined>();
  const [isTouched, setIsTouched] = useState(false);
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        setPreview(fileReader.result);
      }
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const addPictureHandler = () => {
    if (!imageRef.current) {
      return;
    }
    imageRef.current.click();
  };

  const filePickedHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setIsTouched(true);
    let pickedFile: File | null = file;
    let isValid = true;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      isValid = true;
    } else {
      if (!pickedFile) {
        setIsValid(false);
        isValid = false;
      }
    }
    onInput(id, pickedFile, isValid);
  };

  const removePictureHandler = () => {};
  return (
    <div className='form-control'>
      <input
        type='file'
        accept='.jpg,.jpeg,.png'
        id={id}
        style={{ display: 'none' }}
        ref={imageRef}
        onChange={filePickedHandler}
      />
      <div className={`image-upload ${center && 'center'}`}>
        {preview && (
          <div className='image-upload__preview'>
            <img src={preview} alt='Preview' />
          </div>
        )}
        {authForm && (
          <div className='image-upload__actions'>
            <Button
              className='image-upload__actions--add__profile'
              type='button'
              success
              // style={{ marginRight: '2rem' }}
              onClick={addPictureHandler}
            >
              <i
                style={{ height: '1.5rem', fontSize: '1.5rem' }}
                className='fas fa-user-astronaut'
              />
            </Button>
            <Button type='button' danger onClick={removePictureHandler}>
              <i
                style={{ height: '1.5rem', fontSize: '1.5rem' }}
                className='fas fa-times'
              />
            </Button>
          </div>
        )}
        {placeForm && (
          <Button
            style={{ color: 'white' }}
            type='button'
            success
            inverse
            onClick={addPictureHandler}
          >
            <i
              style={{ height: '1.5rem', fontSize: '1.5rem' }}
              className='far fa-image'
            />
            <p style={{ margin: 0 }}>{preview ? 'Change' : 'Add'} picture</p>
          </Button>
        )}
      </div>
      {!isValid && isTouched && (
        <p className='error-text'>Please enter a valid image</p>
      )}
    </div>
  );
};

export default ImageUpload;
