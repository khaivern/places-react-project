import React from 'react';
import ReactDOM from 'react-dom';
import Card from '../UIElements/Card';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

const SideDrawer: React.FC<{ show: boolean; onClick: () => void }> = ({
  children,
  show,
  onClick,
}) => {
  const portalDiv = document.querySelector('#drawer-hook');
  if (!portalDiv) {
    return (
      <div className='centered'>
        <Card>
          <h2>Something went wrong!</h2>
        </Card>
      </div>
    );
  }
  const content = (
    <CSSTransition
      in={show}
      timeout={200}
      classNames='slide-in-left'
      mountOnEnter
      unmountOnExit
      children={
        <aside className='side-drawer' onClick={onClick}>
          {children}
        </aside>
      }
    />
  );
  return ReactDOM.createPortal(content, portalDiv);
};

export default SideDrawer;
