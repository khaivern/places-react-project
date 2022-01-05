import React from 'react';

import './Avatar.css';

interface AvatarProps {
  className?: string;
  style?: string;
  image: string;
  alt: string;
  width?: string;
}

const Avatar: React.FC<AvatarProps> = ({ className, image, alt, width }) => {
  return (
    <div className={`avatar ${className}`}>
      <img src={image} alt={alt} style={{ width: width, height: width }} />
    </div>
  );
};

export default Avatar;
