import React, { useContext } from 'react';

import { NavLink } from 'react-router-dom';
import AuthContext from '../../../store/auth-context';
import Button from '../FormElements/Button/Button';
import './NavLinks.css';

const NavLinks = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = !!authCtx.token;

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/'>ALL USERS</NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to={`/${authCtx.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <NavLink to='/places/new'>ADD PLACE</NavLink>
        </li>
      )}
      {!isLoggedIn && (
        <li>
          <NavLink to='/auth'>AUTHENTICATE</NavLink>
        </li>
      )}
      {isLoggedIn && (
        <li>
          <Button onClick={logoutHandler}>LOGOUT</Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
