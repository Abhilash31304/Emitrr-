import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const style = {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    borderRadius: '9999px',
    textTransform: 'uppercase',
    backgroundColor: variant === 'default' ? 'var(--node-border)' : `var(--${variant}-color)`,
    color: variant === 'default' ? 'var(--text-primary)' : 'white',
  };

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
};

export default Badge;
