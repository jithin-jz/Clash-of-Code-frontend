import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './stores/useAuthStore';
import Login from './components/Login';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import OAuthCallback from './pages/OAuthCallback';
import UserHome from './pages/UserHome';

// Admin pages
import AdminDashboard from './admin/Dashboard';

import Loader from './components/Loader';

// Auth initializer component
const AuthInitializer = ({ children }) => {
    const { loading, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <>
            <Loader isLoading={loading} />
            {!loading && children}
        </>
    );
};

const AppContent = () => {
    return (
        <AuthInitializer>
            <div className="min-h-screen">
                <main>
                    <Routes>
                        {/* Public Landing (Game Map) - Visible to all */}
                        <Route path="/" element={<UserHome />} />

                        {/* Authentication - Public Only */}
                        <Route path="/login" element={
                            <PublicOnlyRoute>
                                <Login />
                            </PublicOnlyRoute>
                        } />

                        {/* Redirect legacy routes to / */}
                        <Route path="/game" element={<Navigate to="/" replace />} />
                        <Route path="/home" element={<Navigate to="/" replace />} />
                        
                        {/* OAuth Callbacks */}
                        <Route 
                            path="/auth/github/callback" 
                            element={<OAuthCallback provider="github" />} 
                        />
                        <Route 
                            path="/auth/google/callback" 
                            element={<OAuthCallback provider="google" />} 
                        />
                        <Route 
                            path="/auth/discord/callback" 
                            element={<OAuthCallback provider="discord" />} 
                        />
                        
                        {/* Admin Dashboard - requires staff/superuser (checked in component) */}
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        
                        {/* Protected Routes */}
                        <Route 
                            path="/profile" 
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </AuthInitializer>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

// Helper component to redirect authenticated users
// Helper component to redirect authenticated users based on role
const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    
    if (isAuthenticated) {
        if (user?.is_staff || user?.is_superuser) {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }
    
    return children;
};

export default App;