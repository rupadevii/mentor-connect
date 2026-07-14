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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute/>}>
                    <Route
                        path="/dashboard"
                        element={
                            <DashboardPage />
                        }
                        />
                    <Route
                        path="/profile"
                        element={
                            <ProfilePage />
                        }
                    />
                    <Route
                        path="/create"
                        element={
                                <CreateSessionPage/>
                        }
                    />
                    <Route
                        path="/sessions"
                        element={
                                <SessionsPage/>
                        }
                    />
                    <Route
                        path="/sessions/:id"
                        element={
                                <SessionDetailsPage/>
                        }
                    />
                    <Route 
                        path="/feedback/mentor/:id" 
                        element={
                                <MentorFeedbackPage/>
                        }/>
                    <Route 
                        path="/feedback/mentee/:id" 
                        element={
                                <MenteeFeedbackPage/>
                        }/>
                </Route>

                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
