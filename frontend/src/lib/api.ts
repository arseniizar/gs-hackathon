// src/lib/api.ts

// Імітуємо затримку мережі
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Мокові дані
const MOCK_CHALLENGE_DETAILS = {
    id: '1',
    title: "Predictive Maintenance Analysis",
    metric: "ROC-AUC",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Дедлайн через 3 дні
    description: "The goal of this challenge is to predict equipment failure based on sensor data. Participants will build a binary classification model. The dataset contains anonymized sensor readings and maintenance history for a fleet of industrial machines. Your task is to predict the probability of failure within the next operational cycle.",
    rules: "Submissions must be a CSV file with two columns: 'id' and 'probability'. The file must contain predictions for all IDs present in test.csv. Maximum 5 submissions per day.",
    dataAssets: [
        { name: 'train.csv', size: '24.5 MB' },
        { name: 'test.csv', size: '8.2 MB' },
        { name: 'sample_submission.csv', size: '1.1 MB' },
    ],
    userSubmissions: [
        { id: 'sub-001', submittedAt: new Date().toISOString(), status: 'Scored', score: 0.8923 },
        { id: 'sub-002', submittedAt: new Date().toISOString(), status: 'Processing', score: null },
        { id: 'sub-003', submittedAt: new Date().toISOString(), status: 'Error', score: null },
    ],
};

export const getChallengeDetails = async (challengeId: string) => {
    console.log(`Fetching details for challenge ${challengeId}...`);
    await sleep(500); // Імітація завантаження
    return MOCK_CHALLENGE_DETAILS;
};