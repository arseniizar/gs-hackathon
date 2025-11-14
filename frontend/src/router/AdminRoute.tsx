import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from './paths';

function AdminRoute() {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
    }

    if (!isAdmin) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <Outlet />;
}

export default AdminRoute;