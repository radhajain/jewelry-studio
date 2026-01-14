import React from 'react';
import clsx from 'clsx';
import styles from './TextArea.module.scss';

interface TextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
	label,
	error,
	className,
	...props
}) => {
	return (
		<div className={styles.container}>
			{label && <label className={styles.label}>{label}</label>}
			<textarea
				className={clsx(styles.textarea, error && styles.error, className)}
				rows={4}
				{...props}
			/>
			{error && <p className={styles.errorMessage}>{error}</p>}
		</div>
	);
};

export default TextArea;
