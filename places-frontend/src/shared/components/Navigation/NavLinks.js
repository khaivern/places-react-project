import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { authActions } from '../../../store/auth';
import Button from '../FormElements/Button';
import './NavLinks.css';

const NavLinks = props => {
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate('/auth', { replace: true });
  };
  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/'>ALL USERS</NavLink>
      </li>
      {isAuthenticated && (
        <li>
          <NavLink to='/u1/places'>MY PLACES</NavLink>
        </li>
      )}
      {isAuthenticated && (
        <li>
          <NavLink to='/places/new'>ADD PLACES</NavLink>
        </li>
      )}
      {!isAuthenticated && (
        <li>
          <NavLink to='/auth'>AUTHENTICATE</NavLink>
        </li>
      )}
      {isAuthenticated && (
        <li>
          <Button onClick={logoutHandler}>LOGOUT</Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
