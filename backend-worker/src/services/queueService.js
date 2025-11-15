import axios from "axios";
import dotenv from "dotenv";
import { scoreSubmission } from "./scoringService.js";

dotenv.config();

const CORE_API = process.env.CORE_API;
const WORKER_SECRET = process.env.WORKER_SECRET;

const seenHashes = new Set();

export const startQueueListener = () => {
    console.log("[Worker] Queue listener started. Polling every 5 seconds...");

    setInterval(async () => {
        try {
            const next = await getNextPendingSubmission();
            if (next) {
                console.log(`[Worker] Found new submission to process: ${next.id}`);
                await processSubmission(next);
            }
        } catch (err) {
            // Errors from getNextPendingSubmission are already logged
        }
    }, 5000);
};

async function getNextPendingSubmission() {
    console.log(`[Worker] ➡️  Sending request to core: GET ${CORE_API}/api/internal/submissions/next`);
    try {
        const response = await axios.get(`${CORE_API}/api/internal/submissions/next`, {
            headers: {
                "X-WORKER-TOKEN": WORKER_SECRET
            }
        });

        // Перевіряємо, чи є дані. Якщо 200 OK, але тіло порожнє, це теж "не знайдено".
        if (!response.data || Object.keys(response.data).length === 0) {
            console.log("[Worker] ⬅️  Received response: No pending submissions.");
            return null;
        }

        console.log(`[Worker] ⬅️  Received response: 200 OK with task ID ${response.data.id}`);
        return response.data;

    } catch (err) {
        if (err.response) {
            // Помилка з відповіддю від сервера (4xx, 5xx)
            console.error(`[Worker] ⬅️  ERROR response from core: ${err.response.status} ${err.response.statusText}`);
            if(err.response.data) console.error("   Response body:", err.response.data);
        } else if (err.request) {
            // Запит було зроблено, але відповідь не отримана (проблема з мережею, недоступний сервер)
            console.error(`[Worker] ⬅️  NETWORK ERROR: No response received from ${CORE_API}. Is backend-core running?`);
        } else {
            // Інша помилка
            console.error("[Worker] ⬅️  AXIOS ERROR:", err.message);
        }
        return null;
    }
}

async function processSubmission(submission) {
    try {
        console.log(`[Worker]   Scoring submission ${submission.id}...`);
        const { score, hash, totalRows, timestamp } = await scoreSubmission(submission);
        console.log(`[Worker]   Scoring complete. Score: ${score}`);

        const payload = {
            status: "DONE",
            score: score,
            hash,
            totalRows,
            timestamp,
        };

        console.log(`[Worker] ➡️  Sending result to core: POST ${CORE_API}/api/internal/submissions/${submission.id}/result`);
        await axios.post(
            `${CORE_API}/api/internal/submissions/${submission.id}/result`,
            payload,
            { headers: { "X-WORKER-TOKEN": WORKER_SECRET } }
        );
        console.log(`[Worker] ⬅️  Result for ${submission.id} sent successfully.`);

    } catch (err) {
        console.error(`[Worker]   Scoring failed for ${submission.id}:`, err.message);
        const errorPayload = {
            status: "FAILED",
            errorMessage: err.message
        };

        try {
            console.log(`[Worker] ➡️  Sending FAILED status to core for ${submission.id}...`);
            await axios.post(
                `${CORE_API}/api/internal/submissions/${submission.id}/result`,
                errorPayload,
                { headers: { "X-WORKER-TOKEN": WORKER_SECRET } }
            );
            console.log(`[Worker] ⬅️  FAILED status sent successfully.`);
        } catch (postErr) {
            console.error(`[Worker]   FATAL: Could not send FAILED status to core.`, postErr.message);
        }
    }
}