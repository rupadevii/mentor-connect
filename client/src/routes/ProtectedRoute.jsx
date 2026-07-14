import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Component to protect routes - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
    const {isAuthenticated, loading} = useContext(AuthContext)
    
    if(loading){
        return <div>...Loading</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet/>
};

export default ProtectedRoute;
