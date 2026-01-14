import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

import Loader from '../common/Loader';

/**
 * AdminRoute - For admin-only pages
 * Requires user to be authenticated AND be staff/superuser
 */
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuthStore();

    if (loading) {
        return <Loader isLoading={true} />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user?.is_staff && !user?.is_superuser) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
