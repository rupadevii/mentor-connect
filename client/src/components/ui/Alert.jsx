import React from 'react';

// Alert component for success/error messages
const Alert = ({ type = 'success', message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-emerald-50' : 'bg-rose-50';
  const textColor = type === 'success' ? 'text-emerald-800' : 'text-rose-800';
  const borderColor = type === 'success' ? 'border-emerald-400' : 'border-rose-400';
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div
      className={`${bgColor} ${textColor} ${borderColor} border-l-4 p-4 mb-6 rounded-xl flex justify-between items-center animate-slide-down`}
    >
      <div className="flex items-center">
        <span className="text-lg mr-3">{icon}</span>
        <p className="font-medium">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="font-bold ml-4 hover:bg-black/10 rounded-full w-6 h-6 flex items-center justify-center transition-colors">
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
