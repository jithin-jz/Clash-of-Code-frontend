import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

/**
 * ProtectedRoute - Requires authentication
 * Redirects unauthenticated users to home page
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
