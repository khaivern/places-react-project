import React, { useContext, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
// import NewPlace from './places/pages/NewPlace';
// import UpdatePlace from './places/pages/UpdatePlace';
// import UserPlaces from './places/pages/UserPlaces';
// import Auth from './users/pages/Auth';
// import Users from './users/pages/Users';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner/LoadingSpinner';
import AuthContext from './store/auth-context';

const Users = React.lazy(() => import('./users/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const Auth = React.lazy(() => import('./users/pages/Auth'));

const App = () => {
  const isLoggedIn = !!useContext(AuthContext).token;

  let routes;
  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path='/' element={<Users />} />
        <Route path='/places/new' element={<NewPlace />} />
        <Route path='/:userId/places' element={<UserPlaces />} />
        <Route path='/places/:placeId' element={<UpdatePlace />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path='/' element={<Users />} />
        <Route path='/:userId/places' element={<UserPlaces />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='*' element={<Navigate to='/auth' />} />
      </Routes>
    );
  }

  return (
    <Router>
      <MainNavigation />
      <main>
        <Suspense
          fallback={
            <div className='center'>
              <LoadingSpinner />{' '}
            </div>
          }
        >
          {routes}
        </Suspense>
      </main>
    </Router>
  );
};

export default App;
