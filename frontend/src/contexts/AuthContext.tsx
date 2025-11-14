import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '@/lib/api';

interface DecodedToken {
    email: string;
    roles: string[];
    exp: number;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    teamName: string | null;
    login: (credentials: object) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [teamName, setTeamName] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken: DecodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    setIsAuthenticated(true);
                    setIsAdmin(decodedToken.roles.includes('ROLE_ADMIN'));
                    setTeamName(decodedToken.email);
                } else {
                    localStorage.removeItem('authToken');
                }
            } catch (error) {
                console.error("Failed to decode token on initial load", error);
                localStorage.removeItem('authToken');
            }
        }
    }, []);

    const login = async (credentials: object) => {
        try {
            const data = await loginUser(credentials);
            const token = data.token;
            localStorage.setItem('authToken', token);
            const decodedToken: DecodedToken = jwtDecode(token);
            setIsAuthenticated(true);
            setIsAdmin(decodedToken.roles.includes('ROLE_ADMIN'));
            setTeamName(decodedToken.email);
        } catch (error) {
            console.error("Login failed:", error);
            // Clear any partial state and re-throw for the UI component to handle
            logout();
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setIsAdmin(false);
        setTeamName(null);
    };

    const value = { isAuthenticated, isAdmin, teamName, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
