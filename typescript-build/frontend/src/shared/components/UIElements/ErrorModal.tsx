import React from 'react';
import Button from '../FormElements/Button';
import Modal from './Modal';

import './ErrorModal.css';

interface Props {
  onClear: () => void;
  error: string;
}

const ErrorModal: React.FC<Props> = ({ onClear, error }) => {
  return (
    <Modal
      header='An Error Occurred'
      footer={<Button onClick={onClear}>CLOSE</Button>}
      onCancel={onClear}
      show={!!error}
      footerClass='error__modal-actions'
    >
      <p>{error}</p>
    </Modal>
  );
};

export default ErrorModal;
