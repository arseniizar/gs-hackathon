import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import AppLayout from '@/App';
import ChallengesListPage from '@/pages/ChallengesListPage';
import ChallengeDetailsPage from '@/pages/ChallengeDetailsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminPage from '@/pages/AdminPage';
import AdminChallengeEditPage from '@/pages/AdminChallengeEditPage';
import TeamProfilePage from '@/pages/TeamProfilePage';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute'; // 👈 Імпортуємо новий компонент
import AdminRoute from './AdminRoute';
import { ROUTES } from './paths';
import SubmissionDetailsPage from "@/pages/SubmissionDetailsPage.tsx";

const routes: RouteObject[] = [
    {
        element: <AppLayout />,
        children: [
            // 👇 Роути, які доступні ТІЛЬКИ для незалогінених користувачів
            {
                element: <PublicOnlyRoute />,
                children: [
                    { path: ROUTES.LOGIN, element: <LoginPage /> },
                    { path: ROUTES.REGISTER, element: <RegisterPage /> },
                ]
            },

            // Роути, доступні для всіх
            { path: ROUTES.HOME, element: <ChallengesListPage /> },

            // Роути, які доступні ТІЛЬКИ для залогінених користувачів
            {
                element: <ProtectedRoute />,
                children: [
                    { path: ROUTES.TEAM_PROFILE, element: <TeamProfilePage /> },
                    { path: ROUTES.CHALLENGE_DETAILS(':challengeId'), element: <ChallengeDetailsPage /> },
                    { path: ROUTES.SUBMISSION_DETAILS(':submissionId'), element: <SubmissionDetailsPage /> },
                ],
            },

            // Роути, які доступні ТІЛЬКИ для адмінів
            {
                element: <AdminRoute />,
                children: [
                    { path: ROUTES.ADMIN, element: <AdminPage /> },
                    { path: ROUTES.ADMIN_USERS, element: <AdminPage /> },
                    { path: ROUTES.ADMIN_CHALLENGE_NEW, element: <AdminChallengeEditPage /> },
                    { path: ROUTES.ADMIN_CHALLENGE_EDIT(':challengeId'), element: <AdminChallengeEditPage /> },
                ],
            },

            // Сторінка не знайдена
            { path: '*', element: <NotFoundPage /> },
        ],
    },
];

export const router = createBrowserRouter(routes);