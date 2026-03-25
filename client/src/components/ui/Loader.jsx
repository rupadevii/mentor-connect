import React from 'react';

// Loading spinner component
const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-indigo-600"></div>
    </div>
  );
};

export default Loader;
