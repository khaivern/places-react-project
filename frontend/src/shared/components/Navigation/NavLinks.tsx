import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState, useAppDispatch } from '../../../store';
import { authActions } from '../../../store/auth';
import Button from '../FormElements/Button';
import './NavLinks.css';
const NavLinks: React.FC = () => {
  const isLoggedIn = useSelector<RootState>((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();
  const logoutHandler = () => {
    dispatch(authActions.logout());
  };

  return (
    <ul className='nav-links'>
      <li>
        <NavLink to='/'>ALL USERS</NavLink>
      </li>
      {isLoggedIn && (
        <li>
          <NavLink to='/u1/places'>MY PLACES</NavLink>
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
      {isLoggedIn && <Button onClick={logoutHandler}>LOGOUT</Button>}
    </ul>
  );
};

export default NavLinks;
