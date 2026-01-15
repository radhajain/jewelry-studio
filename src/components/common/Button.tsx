import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

type size = 'small' | 'medium' | 'large';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'text';
	children: React.ReactNode;
	size?: size;
}

const Button: React.FC<ButtonProps> = ({
	variant = 'primary',
	children,
	className,
	size = 'medium',
	...props
}) => {
	const variantClasses = {
		primary: styles.primary,
		secondary: styles.secondary,
		text: styles.text,
	};

	const sizeClasses: Record<size, string> = {
		small: styles.small,
		medium: styles.medium,
		large: styles.large,
	};

	return (
		<button
			className={clsx(
				styles.button,
				variantClasses[variant],
				sizeClasses[size],
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
