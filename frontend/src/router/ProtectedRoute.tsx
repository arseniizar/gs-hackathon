import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from './paths';

function ProtectedRoute() {
    const { isAuthenticated, isProfileComplete } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
    }

    if (!isProfileComplete && location.pathname !== ROUTES.TEAM_PROFILE) {
        return <Navigate to={ROUTES.TEAM_PROFILE} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;