import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className,
  ...props
}) => {
  const variantClasses = {
    primary: styles.primary,
    secondary: styles.secondary,
    text: styles.text,
  };

  return (
    <button
      className={clsx(styles.button, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
