import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  onClick,
}) => {
  return (
    <div
      className={clsx(styles.card, hover && styles.hover, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
