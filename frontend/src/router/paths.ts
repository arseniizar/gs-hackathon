export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ADMIN: '/admin',
    ADMIN_USERS: '/admin/users', // 👈 Новий шлях
    ADMIN_CHALLENGE_NEW: '/admin/challenges/new', // 👈 Новий шлях
    ADMIN_CHALLENGE_EDIT: (challengeId: string) => `/admin/challenges/edit/${challengeId}`, // 👈 Новий шлях
    CHALLENGE_DETAILS: (challengeId: string | number) => `/challenges/${challengeId}`,
};