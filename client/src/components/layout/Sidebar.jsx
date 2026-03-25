import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getInitials } from '../../utils/helpers';

// Sidebar component with navigation items
const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Profile', path: '/profile', icon: '👤' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky md:top-0 left-0 top-0 h-screen ${isCollapsed ? 'md:w-20' : 'md:w-72'} w-72 bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#172554] text-white z-50 md:z-20 transform md:transform-none transition-all duration-300 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 text-2xl hover:text-gray-300 transition-colors"
        >
          ×
        </button>

        {/* Logo */}
        <div className={`p-5 border-b border-white/10 ${isCollapsed ? 'md:px-3' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between gap-3'}`}>
            {!isCollapsed ? (
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Accio</h1>
                <p className="text-slate-300 text-xs">Mentor Connect</p>
              </div>
            ) : (
              <h1 className="text-lg font-bold text-white">A</h1>
            )}

            <button
              onClick={onToggleCollapse}
              className="hidden md:inline-flex w-8 h-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-slate-200 hover:bg-white/20"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? '→' : '←'}
            </button>
          </div>

          {user && (
            <div className={`mt-4 ${isCollapsed ? 'flex justify-center' : 'flex items-center gap-3'}`}>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-500 text-white flex items-center justify-center text-sm font-bold border border-white/20">
                {user?.profilePicture?.url ? (
                  <img src={user.profilePicture.url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.name || 'User')
                )}
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-xs text-slate-300">Level {user.level}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 md:p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              title={item.name}
              className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-300/30 shadow-lg shadow-cyan-900/20'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white border border-transparent'
              }`}
            >
              <span className={`${isCollapsed ? '' : 'mr-3'} text-lg`}>{item.icon}</span>
              {!isCollapsed && item.name}
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-4 left-3 right-3 md:left-4 md:right-4">
          <button
            onClick={handleLogout}
            title="Logout"
            className={`w-full ${isCollapsed ? 'px-2' : 'px-4'} py-2.5 bg-rose-500/90 hover:bg-rose-500 rounded-xl transition-colors duration-200 flex items-center ${isCollapsed ? 'justify-center' : 'justify-center'}`}
          >
            <span className={`${isCollapsed ? '' : 'mr-2'}`}>🚪</span>
            {!isCollapsed && 'Logout'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
