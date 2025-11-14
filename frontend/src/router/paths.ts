export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    LEADERBOARD: '/leaderboard',
    // Для динамічних шляхів створюємо функцію
    CHALLENGE_DETAILS: (challengeId: string | number) => `/challenges/${challengeId}`,
};