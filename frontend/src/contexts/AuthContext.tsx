import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (teamName: string) => void;
    logout: () => void;
    teamName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [teamName, setTeamName] = useState<string | null>(null);
    const isAuthenticated = !!teamName;

    const login = (name: string) => {
        setTeamName(name);
        // В реальному додатку тут буде запит до API та збереження токену
    };

    const logout = () => {
        setTeamName(null);
        // В реальному додатку тут буде видалення токену
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, teamName, login, logout }}>
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