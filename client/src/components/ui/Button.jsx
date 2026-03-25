import React from 'react';

// Reusable Button component
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'bg-rose-600 text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 focus:ring-rose-500',
    success: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 focus:ring-emerald-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-60' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
