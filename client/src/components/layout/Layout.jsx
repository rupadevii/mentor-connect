import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from './Sidebar';
import Header from './Header';

// Main layout wrapper
const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const loadCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setCurrentUser(response?.data?.user || null);
    } catch (error) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, [location.pathname]);

  useEffect(() => {
    const onProfileUpdated = (event) => {
      if (event?.detail) {
        setCurrentUser(event.detail);
      } else {
        loadCurrentUser();
      }
    };

    window.addEventListener('profile-updated', onProfileUpdated);
    return () => window.removeEventListener('profile-updated', onProfileUpdated);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        user={currentUser}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          onMenuClick={toggleSidebar}
          onToggleCollapse={toggleSidebarCollapse}
          isSidebarCollapsed={sidebarCollapsed}
          user={currentUser}
        />

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
