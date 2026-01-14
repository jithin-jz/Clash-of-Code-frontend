import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

import Loader from '../common/Loader';

/**
 * ProtectedRoute - Requires authentication
 * Redirects unauthenticated users to home page
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return <Loader isLoading={true} />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
