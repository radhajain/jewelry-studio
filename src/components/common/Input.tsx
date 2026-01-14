import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <input
        className={clsx('input', error && 'border-red-800', className)}
        {...props}
      />
      {error && (
        <p className="text-body-small text-red-800 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
