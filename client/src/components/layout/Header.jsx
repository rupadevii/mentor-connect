import React from 'react';
import { getInitials } from '../../utils/helpers';

// Header component
const Header = ({ onMenuClick, onToggleCollapse, isSidebarCollapsed, user }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 md:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Menu button for mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-2xl text-slate-700 hover:text-indigo-600 transition-colors duration-200"
        >
          ☰
        </button>

        {/* Collapse button for desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Logo */}
      <div className="flex-1 ml-3 md:ml-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Accio Mentor Connect
        </h1>
      </div>

      {user && (
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-600 text-white flex items-center justify-center text-sm font-bold border border-indigo-200">
            {user?.profilePicture?.url ? (
              <img src={user.profilePicture.url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(user?.name || 'User')
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
            <p className="text-xs text-slate-500">Level {user.level}</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
