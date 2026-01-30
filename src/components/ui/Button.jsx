import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'medium',
  disabled = false,
  className = '',
  ...props 
}) => {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
