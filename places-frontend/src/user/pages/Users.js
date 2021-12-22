import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      image:
        'https://i.picsum.photos/id/39/200/200.jpg?hmac=Q0ovKQ8Rm51WeQ057IqUXwL_1r7V0S8VtWwdZNpXW7E',
      name: 'USER 1',
      places: 3,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
