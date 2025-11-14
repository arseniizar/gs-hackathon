export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    LEADERBOARD: '/leaderboard',
    ADMIN: '/admin', // Add the new admin route
    // For dynamic paths, create a function
    CHALLENGE_DETAILS: (challengeId: string | number) => `/challenges/${challengeId}`,
};
