import UsersList from '../components/UsersList';

import User from '../../models/user';

const DUMMY_USERS: User[] = [
  {
    id: 'u1',
    image:
      'https://i.picsum.photos/id/418/200/200.jpg?hmac=FPLIYEnmfmXtqHPsuZvUzJeXJJbbxMWNq6Evh7mMSN4',
    name: 'Maximus Prime',
    placeCount: 3,
  },
  {
    id: 'u2',
    image:
      'https://i.picsum.photos/id/313/200/200.jpg?hmac=rh2PdOLFkEclUr6nN2KdavcsSZIHVkYnv9D0BtJjykA',
    name: 'Bumble Bee',
    placeCount: 5,
  },
];

const Users = () => {
  return <UsersList items={DUMMY_USERS} />;
};

export default Users;
