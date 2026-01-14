import React from 'react';
import clsx from 'clsx';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full px-4 py-3 border border-stone-200 rounded-minimal',
          'font-sans text-base transition-all duration-200',
          'focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500',
          'placeholder:text-stone-400 resize-none',
          error && 'border-red-800',
          className
        )}
        rows={4}
        {...props}
      />
      {error && (
        <p className="text-body-small text-red-800 mt-1">{error}</p>
      )}
    </div>
  );
};

export default TextArea;
