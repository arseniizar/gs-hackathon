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

    let score;

    switch (submission.type) {
        case "RMSE":
            score = calculateRMSE(y_true, y_pred);
            break;

        case "ACCURACY":
            score = calculateAccuracy(y_true, y_pred);
            break;

        case "AUC":
            score = calculateAUC(y_true, y_pred);
            break;

        default:
            throw new Error("Unknown submission type: " + submission.type);
    }

    const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(userPred))
        .digest("hex");

    return {
        score,
        hash,
        totalRows: y_pred.length,
        timestamp: Date.now(),
        type: submission.type
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

function calculateAccuracy(y_true, y_pred) {
    let correct = 0;
    for (let i = 0; i < y_true.length; i++) {
        if (Math.round(y_pred[i]) === y_true[i]) correct++;
    }
    return correct / y_true.length;
}

// Correct AUC implementation
function calculateAUC(y_true, y_pred) {
    const pairs = y_true.map((y, i) => ({ y, pred: y_pred[i] }));
    pairs.sort((a, b) => b.pred - a.pred);

    let tp = 0;
    let fp = 0;
    let auc = 0;

    const P = y_true.filter(v => v === 1).length;
    const N = y_true.filter(v => v === 0).length;

    for (const p of pairs) {
        if (p.y === 1) {
            tp++;
        } else {
            fp++;
            auc += tp; // add the current TPR
        }
    }

    return auc / (P * N);
}