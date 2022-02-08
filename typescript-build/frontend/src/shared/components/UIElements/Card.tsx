import React from 'react';

import './Card.css';

const Card: React.FC<{ className?: string; style?: React.CSSProperties }> = ({
  className,
  children,
  style,
}) => {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
