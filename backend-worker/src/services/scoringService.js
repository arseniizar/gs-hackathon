import fs from "fs";
import csvParser from "csv-parser";
import crypto from "crypto";

export async function scoreSubmission(submission) {
    const groundTruth = await loadCsv("data/ground_truth.csv");
    const userPred = await loadCsv(submission.filePath);

    const gtMap = new Map();
    for (const row of groundTruth) {
        gtMap.set(row.id, parseFloat(row.y_true));
    }

    const y_true = [];
    const y_pred = [];

    for (const row of userPred) {
        const id = row.id;
        if (!gtMap.has(id)) continue;
        y_true.push(gtMap.get(id));
        y_pred.push(parseFloat(row.pred));
    }

    if (y_true.length === 0) {
        throw new Error("Submission contains no matching IDs");
    }

    const score = calculateRMSE(y_true, y_pred);

    const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(userPred))
        .digest("hex");

    return {
        score,
        hash,
        totalRows: y_pred.length,
        timestamp: Date.now()
    };
}

function loadCsv(path) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(path)
            .pipe(csvParser())
            .on("data", (row) => results.push(row))
            .on("end", () => resolve(results))
            .on("error", reject);
    });
}

function calculateRMSE(y_true, y_pred) {
    let sum = 0;
    for (let i = 0; i < y_true.length; i++) {
        const diff = y_true[i] - y_pred[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum / y_true.length);
}
