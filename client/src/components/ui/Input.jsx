import React from 'react';

// Reusable Input component
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 ${
          error
            ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
            : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-500'
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
