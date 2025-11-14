import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUser } from '@/lib/api'; // We created this in step 2.1
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/router/paths';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await registerUser(formData);
            // On success, redirect to login
            navigate(ROUTES.LOGIN);
        } catch (err: any) {
            // Check if the error response has a message, otherwise default
            const msg = err.response?.data || 'Registration failed. Please try again.';
            setError(typeof msg === 'string' ? msg : 'Registration failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-24 px-4">
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-serif">Register Team</CardTitle>
                    <CardDescription>
                        Create an account to participate in the Hackathon.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="displayName">Team / User Name</Label>
                            <Input
                                id="displayName"
                                required
                                value={formData.displayName}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="Team Alpha"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="user@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default RegisterPage;
