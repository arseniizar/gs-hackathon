import axios from "axios";
import dotenv from "dotenv";
import { scoreSubmission } from "./scoringService.js";

dotenv.config();

const CORE_API = process.env.CORE_API;
const WORKER_SECRET = process.env.WORKER_SECRET;

// Track seen submission hashes to detect duplicates/plagiarism
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
                "X-Worker": WORKER_SECRET
            }
        });

        if (!response.data) return null;
        return response.data;

    } catch (err) {
        // Treat 404 as "no pending submissions"
        if (err.response?.status === 404) {
            return null;
        }

        console.error("Error fetching next submission:", err.message);
        return null;
    }
}

async function processSubmission(submission) {
    try {
        // scoreSubmission returns an OBJECT: { score, hash, totalRows, timestamp }
        const { score, hash, totalRows, timestamp } = await scoreSubmission(submission);

        let finalScore = score;
        let plagiarism = false;

        if (seenHashes.has(hash)) {
            console.log("Duplicate submission hash detected, marking as plagiarism. Hash:", hash);
            finalScore = 0;
            plagiarism = true;
        } else {
            seenHashes.add(hash);
        }

        // Send result back to backend-core.
        // If your backend only expects "status" and "score",
        // you can drop hash/totalRows/timestamp from the body.
        await axios.post(
            `${CORE_API}/api/internal/submissions/${submission._id}/result`,
            {
                status: "DONE",
                score: finalScore,
                hash,
                totalRows,
                timestamp,
                plagiarism
            },
            {
                headers: {
                    "X-Worker": WORKER_SECRET
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
                errorMessage: err.message || "Unknown error"
            },
            {
                headers: {
                    "X-Worker": WORKER_SECRET
                }
            }
        );
    }
}