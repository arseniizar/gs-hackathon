export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ADMIN: '/admin',
    ADMIN_USERS: '/admin/users',
    ADMIN_CHALLENGE_NEW: '/admin/challenges/new',
    ADMIN_CHALLENGE_EDIT: (challengeId: string) => `/admin/challenges/edit/${challengeId}`,
    TEAM_PROFILE: '/team/profile',
    CHALLENGE_DETAILS: (challengeId: string | number) => `/challenges/${challengeId}`,
    SUBMISSION_DETAILS: (submissionId: string) => `/submissions/${submissionId}`,
};