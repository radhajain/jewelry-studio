import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, hover = false, onClick }) => {
  return (
    <div
      className={clsx(
        hover ? 'card-hover' : 'card',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
