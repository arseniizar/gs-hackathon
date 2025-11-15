import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from './paths';

function PublicOnlyRoute() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        // Якщо користувач залогінений, перенаправляємо його на головну сторінку.
        return <Navigate to={ROUTES.HOME} replace />;
    }

    // Якщо не залогінений, показуємо сторінку (Login або Register).
    return <Outlet />;
}

export default PublicOnlyRoute;