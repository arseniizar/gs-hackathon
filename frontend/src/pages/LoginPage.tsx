import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/router/paths';

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || ROUTES.HOME;

    const handleLogin = () => {
        login('Team Alpha'); // Симулюємо логін
        navigate(from, { replace: true });
    };

    return (
        <div className="mx-auto max-w-md px-8 py-16 md:py-24 text-center">
            <h1 className="text-5xl font-medium">Login</h1>
            <p className="mt-4 text-muted-foreground">This is a demo login.</p>
            <Button onClick={handleLogin} className="mt-6">
                Log in as Team Alpha
            </Button>
        </div>
    );
}

export default LoginPage;
