import axios from "axios";
import dotenv from "dotenv";
import { scoreSubmission } from "./scoringService.js";

dotenv.config();

const CORE_API = process.env.CORE_API;
const WORKER_SECRET = process.env.WORKER_SECRET;

const seenHashes = new Set();

export const startQueueListener = () => {
    console.log("Queue listener started...");

    setInterval(async () => {
        try {
            const next = await getNextPendingSubmission();
            if (next) {
                console.log("Found submission:", next._id);
                await processSubmission(next);
            }
        } catch (err) {
            console.error("Queue listener error:", err.message);
        }
    }, 5000);
};

async function getNextPendingSubmission() {
    try {
        const response = await axios.get(`${CORE_API}/api/internal/submissions/next`, {
            headers: {
                "X-WORKER-TOKEN": WORKER_SECRET
            }
        });

        if (!response.data) return null;
        return response.data;

    } catch (err) {
        if (err.response?.status === 404) return null;

        console.error("Error fetching next submission:", err.message);
        return null;
    }
}

async function processSubmission(submission) {
    try {
        const { score, hash, totalRows, timestamp, type } =
            await scoreSubmission(submission);

        let finalScore = score;
        let plagiarism = false;

        if (seenHashes.has(hash)) {
            plagiarism = true;
            finalScore = 0;
            console.log("⚠ Duplicate submission detected:", hash);
        } else {
            seenHashes.add(hash);
        }

        await axios.post(
            `${CORE_API}/api/internal/submissions/${submission._id}/result`,
            {
                status: "DONE",
                score: finalScore,
                type,
                hash,
                totalRows,
                timestamp,
                plagiarism
            },
            {
                headers: {
                    "X-WORKER-TOKEN": WORKER_SECRET
                }
            }
        );

        console.log("Result sent to backend-core");

    } catch (err) {
        console.error("Scoring failed:", err);

        await axios.post(
            `${CORE_API}/api/internal/submissions/${submission._id}/result`,
            {
                status: "FAILED",
                errorMessage: err.message
            },
            {
                headers: {
                    "X-WORKER-TOKEN": WORKER_SECRET
                }
            }
        );
    }
}