import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthHook from './hooks/auth-hook';
// import NewPlace from './places/pages/NewPlace';
// import UpdatePlace from './places/pages/UpdatePlace';
// import UserPlaces from './places/pages/UserPlaces';
// import Auth from './users/pages/Auth';
// import Users from './users/pages/Users';
import MainNavigation from './shared/components/Navigation/MainNavigation';

const Users = React.lazy(() => import('./users/pages/Users'));
const Auth = React.lazy(() => import('./users/pages/Auth'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));

const App = () => {
  const { token } = useAuthHook();

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
      <main>
        <Suspense
          fallback={
            <div className='centered'>
              <p>Loading...</p>
            </div>
          }
        >
          {routes}
        </Suspense>
      </main>
    </BrowserRouter>
  );
};

export default App;
