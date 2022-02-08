import UsersList from '../components/UsersList';

import User from '../../models/user';
import { useEffect, useState } from 'react';
import Card from '../../shared/components/UIElements/Card';

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const res = await fetch(process.env.REACT_APP_BACKEND_URL + '/auth/users');
      const data = await res.json();
      if (res.status !== 200) {
        throw new Error(data.message);
      }
      const { users } = data;
      const updatedUsers = users.map((user: User) => {
        return { ...user, placeCount: user.places ? user.places.length : 0 };
      });
      setLoadedUsers(updatedUsers);
      setIsLoading(false);
    };
    fetchUsers().catch((err) => console.log(err));
  }, []);
  if (isLoading) {
    return (
      <div className='centered'>
        <Card>
          <h2>Loading...</h2>
        </Card>
      </div>
    );
  }
  return <UsersList items={loadedUsers} />;
};

export default Users;
