import User from '../../models/user';
import { Link } from 'react-router-dom';
import './UserItem.css';
import Avatar from '../../shared/components/UIElements/Avatar';

import './UserItem.css';
import Card from '../../shared/components/UIElements/Card';

const UserItem: React.FC<User> = ({ id, name, imageURL, placeCount }) => {
  return (
    <li className='user-item'>
      <Card className='user-item__content'>
        <Link to={`/${id}/places`}>
          <div className='user-item__image'>
            <Avatar image={imageURL} alt={name} />
          </div>
          <div className='user-item__info'>
            <h2>{name}</h2>
            <h3>
              {placeCount} {placeCount === 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
