import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import AppLayout from '@/App';
import ChallengesListPage from '@/pages/ChallengesListPage';
import ChallengeDetailsPage from '@/pages/ChallengeDetailsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminPage from '@/pages/AdminPage';
import AdminChallengeEditPage from '@/pages/AdminChallengeEditPage'; // 👈 Нова сторінка
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import { ROUTES } from './paths';

const routes: RouteObject[] = [
    {
        element: <AppLayout />,
        children: [
            { path: ROUTES.HOME, element: <ChallengesListPage /> },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: ROUTES.REGISTER, element: <RegisterPage /> },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: ROUTES.CHALLENGE_DETAILS(':challengeId'), element: <ChallengeDetailsPage /> },
                ],
            },
            {
                element: <AdminRoute />,
                children: [
                    { path: ROUTES.ADMIN, element: <AdminPage /> },
                    { path: ROUTES.ADMIN_USERS, element: <AdminPage /> }, // 👈 AdminPage обробляє таби
                    { path: ROUTES.ADMIN_CHALLENGE_NEW, element: <AdminChallengeEditPage /> },
                    { path: ROUTES.ADMIN_CHALLENGE_EDIT(':challengeId'), element: <AdminChallengeEditPage /> },
                ],
            },
            { path: '*', element: <NotFoundPage /> },
        ],
    },
];

export const router = createBrowserRouter(routes);