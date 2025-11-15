import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser, getTeamProfile } from '@/lib/api';

interface DecodedToken {
    email: string;
    roles: string[];
    exp: number;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean;
    teamName: string | null;
    isProfileComplete: boolean;
    login: (credentials: object) => Promise<void>;
    logout: () => void;
    refreshAuthInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [teamName, setTeamName] = useState<string | null>(null);
    const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);

    const refreshAuthInfo = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // Якщо токена немає, виходимо
            logout();
            return;
        }

        try {
            const decodedToken: DecodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 > Date.now()) {
                setIsAuthenticated(true);
                setIsAdmin(decodedToken.roles.includes('ROLE_ADMIN'));

                const profile = await getTeamProfile();
                if (profile && profile.teamName) {
                    setTeamName(profile.teamName);
                    setIsProfileComplete(true);
                } else {
                    setTeamName(null);
                    setIsProfileComplete(false);
                }
            } else {
                logout();
            }
        } catch (error) {
            console.error("Failed to refresh auth info or decode token", error);
            logout();
        }
    };

    useEffect(() => {
        refreshAuthInfo();
    }, []);

    const login = async (credentials: object) => {
        try {
            const data = await loginUser(credentials);
            localStorage.setItem('authToken', data.token);
            await refreshAuthInfo();
        } catch (error) {
            console.error("Login failed:", error);
            logout();
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setIsAdmin(false);
        setTeamName(null);
        setIsProfileComplete(false);
    };

    const value = { isAuthenticated, isAdmin, teamName, isProfileComplete, login, logout, refreshAuthInfo };

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