import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner/LoadingSpinner';

import useHttp from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal/ErrorModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const { isLoading, error, sendRequest, resetError } = useHttp();
  useEffect(() => {
    sendRequest(process.env.REACT_APP_BACKEND_URL + '/users').then((response) =>
      setUsers(response.users)
    );
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={resetError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && users.length > 0 && <UsersList items={users} />}
    </>
  );
};

export default Users;
