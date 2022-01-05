import User from '../../models/user';
import Card from '../../shared/components/UIElements/Card';
import UserItem from './UserItem';

import './UsersList.css';
interface UsersListProps {
  items: User[];
}

const UsersList: React.FC<UsersListProps> = ({ items }) => {
  if (items && items.length === 0) {
    return (
      <div className='centered'>
        <Card>
          <h2>No Users Found</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className='users-list'>
      {items &&
        items.map((user) => (
          <UserItem
            key={user.id}
            id={user.id}
            name={user.name}
            image={user.image}
            placeCount={user.placeCount}
          />
        ))}
    </ul>
  );
};

export default UsersList;
