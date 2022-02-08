import React from 'react';
import Card from '../../shared/components/UIElements/Card/Card';
import UsersItem from './UsersItem';
import './UsersList.css';

const UsersList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h2>No users found</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className='users-list'>
      {items.map((user) => (
        <UsersItem
          key={user.id}
          id={user.id}
          image={user.imageUrl}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
