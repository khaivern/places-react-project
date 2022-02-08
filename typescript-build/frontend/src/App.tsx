import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthHook from './hooks/auth-hook';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Auth from './users/pages/Auth';
import Users from './users/pages/Users';

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
      <main>{routes}</main>
    </BrowserRouter>
  );
};

export default App;
