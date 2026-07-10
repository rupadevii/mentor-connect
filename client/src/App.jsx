import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CreateSessionPage from './pages/CreateSessionPage';

// Components
import ProtectedRoute from './routes/ProtectedRoute';
import SessionsPage from './pages/SessionsPage';
import MentorFeedbackPage from './pages/MentorFeedbackPage';
import MenteeFeedbackPage from './pages/MenteeFeedbackPage';
import SessionDetailsPage from './pages/SessionDetailsPage';

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                        <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                        <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create"
                    element={
                        <ProtectedRoute>
                            <CreateSessionPage/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sessions"
                    element={
                        <ProtectedRoute>
                            <SessionsPage/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sessions/:id"
                    element={
                        <ProtectedRoute>
                            <SessionDetailsPage/>
                        </ProtectedRoute>
                    }
                />

                <Route 
                    path="/feedback/mentor/:id" 
                    element={
                        <ProtectedRoute>
                            <MentorFeedbackPage/>
                        </ProtectedRoute>
                    }/>

                <Route 
                    path="/feedback/mentee/:id" 
                    element={
                        <ProtectedRoute>
                            <MenteeFeedbackPage/>
                        </ProtectedRoute>
                    }/>
                
                {/* Redirect */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
