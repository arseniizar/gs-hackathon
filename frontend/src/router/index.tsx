import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import AppLayout from '@/App'; // App.tsx тепер буде нашим лейаутом
import ChallengesListPage from '@/pages/ChallengesListPage';
import ChallengeDetailsPage from '@/pages/ChallengeDetailsPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import { ROUTES } from './paths';

const routes: RouteObject[] = [
    {
        element: <AppLayout />,
        children: [
            {
                path: ROUTES.HOME,
                element: <ChallengesListPage />,
            },
            {
                path: ROUTES.LOGIN,
                element: <LoginPage />,
            },
            {
                path: ROUTES.REGISTER,
                element: <RegisterPage />,
            },
            // Protected Routes
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: ROUTES.LEADERBOARD,
                        element: <LeaderboardPage />,
                    },
                    {
                        // Використовуємо функцію для створення динамічного шляху
                        path: ROUTES.CHALLENGE_DETAILS(':challengeId'),
                        element: <ChallengeDetailsPage />,
                    },
                ],
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
];

export const router = createBrowserRouter(routes);