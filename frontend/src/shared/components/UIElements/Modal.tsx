import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Card from './Card';
import Backdrop from './Backdrop';
import './Modal.css';

interface ModalOverlayProps {
  className?: string;
  headerClass?: string;
  header: string;
  onSubmit?: () => {};
  contentClass?: string;
  footerClass?: string;
  footer: React.ReactNode;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({
  className,
  headerClass,
  header,
  onSubmit,
  contentClass,
  children,
  footerClass,
  footer,
}) => {
  const portalDiv = document.querySelector('#modal-hook');
  const errorBlock = (
    <div className='centered'>
      <Card>
        <h2>Something went wrong!</h2>
      </Card>
    </div>
  );
  const content = (
    <div className={`modal ${className}`}>
      <header className={`modal__header ${headerClass}`}>
        <h2>{header}</h2>
      </header>
      <form onSubmit={onSubmit ? onSubmit : (e) => e.preventDefault()}>
        <div className={`modal__content ${contentClass}`}>{children}</div>
        <footer className={`modal__footer ${footerClass}`}>{footer}</footer>
      </form>
    </div>
  );
  return portalDiv ? ReactDOM.createPortal(content, portalDiv) : errorBlock;
};

interface ModalProps extends ModalOverlayProps {
  onCancel: () => void;
  show: boolean;
}
const Modal: React.FC<ModalProps> = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel}></Backdrop>}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        classNames='modal'
        timeout={200}
        children={<ModalOverlay {...props} />}
      />
    </>
  );
};

export default Modal;
