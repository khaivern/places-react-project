import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Auth from './users/pages/Auth';
import Users from './users/pages/Users';
import { RootState, useAppDispatch } from './store';
import { useEffect } from 'react';
import { authActions } from './store/auth';

let timer: NodeJS.Timeout;

const App = () => {
  const token = useSelector<RootState>((state) => state.auth.token) as
    | string
    | null;
  const userId = useSelector<RootState>((state) => state.auth.userId) as
    | string
    | null;
  const expiration = useSelector<RootState>(
    (state) => state.auth.expiration
  ) as string | null;

  const dispatch = useAppDispatch();
  // auto-login -> set expiration token date
  useEffect(() => {
    if (token && userId && expiration) {
      console.log(new Date(expiration));
      dispatch(authActions.login({ token, userId, expiration }));
    }
  }, [dispatch, token, userId, expiration]);

  // auto-logout -> chk s.exp > c.exp
  useEffect(() => {
    if (token && userId && expiration) {
      const remainingTime =
        new Date(expiration).getTime() - new Date().getTime();
      console.log(remainingTime);
      if (remainingTime > 0) {
        // exp.date ahead curr.date
        timer = setTimeout(() => dispatch(authActions.logout()), remainingTime);
      }
    } else {
      // curr.date ahead exp.date or manual logout
      clearTimeout(timer);
    }
  }, [token, userId, expiration, dispatch]);

  let routes: React.ReactElement;

  if (token) {
    routes = (
      <Routes>
        <Route path='/' element={<Users />} />
        <Route path='/:uid/places' element={<UserPlaces />} />
        <Route path='/places/new' element={<NewPlace />} />
        <Route path='/places/:pid' element={<UpdatePlace />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path='/' element={<Users />} />
        <Route path='/:uid/places' element={<UserPlaces />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='*' element={<Navigate to='/auth' />} />
      </Routes>
    );
  }

  return (
    <BrowserRouter>
      <MainNavigation />
      <main>{routes}</main>
    </BrowserRouter>
  );
};

export default App;
