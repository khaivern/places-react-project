import UsersList from '../components/UsersList';

import User from '../../models/user';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import useHttpHook from '../../hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const Users = () => {
  const { isLoading, httpError, sendRequest, clearError } = useHttpHook();
  const [loadedUsers, setLoadedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const resData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + '/auth/users'
      );

      if (resData.error) {
        throw new Error(resData.error);
      }
      const { users } = resData;
      const updatedUsers = users.map((user: User) => {
        return { ...user, placeCount: user.places ? user.places.length : 0 };
      });
      setLoadedUsers(updatedUsers);
    };
    fetchUsers().catch((err) => console.log(err));
  }, [sendRequest]);

  if (isLoading) {
    return (
      <div className='centered'>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!isLoading && httpError) {
    return <ErrorModal error={httpError} onClear={clearError} />;
  }

  return <UsersList items={loadedUsers} />;
};

export default Users;
