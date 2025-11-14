import { Link, Outlet } from 'react-router-dom';
import { ThemeToggle } from './components/theme-toggle';
import { Button } from './components/ui/button';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { ROUTES } from './router/paths';
import { useAuth } from './contexts/AuthContext';

function AppLayout() {
    const { isAuthenticated, teamName, logout, isAdmin } = useAuth();

    return (
        <div className="min-h-screen w-full bg-background text-foreground font-sans">
            <header className="flex h-16 items-center justify-between border-b px-8 md:px-16">
                <div className="flex items-center gap-8">
                    <Link to={ROUTES.HOME} className="text-lg font-bold tracking-wider font-sans">
                        GS HACKATHON
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-foreground/70">
                        <Link to={ROUTES.HOME} className="transition-colors hover:text-foreground">Challenges</Link>
                        <Link to={ROUTES.LEADERBOARD} className="transition-colors hover:text-foreground">Leaderboard</Link>
                        {isAdmin && (
                            <Link to={ROUTES.ADMIN} className="flex items-center gap-1 font-semibold text-primary transition-colors hover:text-foreground">
                                <ShieldCheck className="h-4 w-4" />
                                Admin
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost">{teamName}</Button>
                            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
                        </>
                    ) : (
                        <Button asChild variant="outline" size="sm">
                            <Link to={ROUTES.LOGIN}>Login</Link>
                        </Button>
                    )}
                    <ThemeToggle />
                </div>
            </header>

            <div className="flex items-center justify-center gap-3 border-b bg-secondary p-2.5 text-sm text-secondary-foreground">
                <AlertTriangle className="h-4 w-4" />
                <p>
                    <span className="font-semibold">NOTICE:</span> Submissions are final. Please review your solution carefully.
                </p>
            </div>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;
