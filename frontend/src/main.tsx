import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import {ThemeProvider} from './components/theme-provider';
import {AuthProvider} from './contexts/AuthContext';
import {router} from './router'; // Наш новий роутер
import './index.css';
import {ToastProvider} from "@/components/ui/toaster.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ToastProvider>
                <AuthProvider>
                    <RouterProvider router={router}/>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    </StrictMode>
);
