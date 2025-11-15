import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from "csv-parser";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function scoreSubmission(submission, groundTruthFileName = null) {
    let metric = submission.metric.toUpperCase();
    if (metric === 'F1-SCORE') metric = 'F1'

    if (!groundTruthFileName) {
        if (metric === 'ACCURACY') groundTruthFileName = 'ground_truth_accuracy.csv';
        else if (metric === 'RMSE') groundTruthFileName = 'ground_truth_rmse.csv';
        else if (metric === 'ROC-AUC') groundTruthFileName = 'ground_truth_auc.csv';
        else if (metric === 'F1') groundTruthFileName = 'ground_truth_accuracy.csv'
        else throw new Error(`Unsupported metric: ${submission.metric}`);
    }

    const groundTruthPath = path.resolve(__dirname, '../../data', groundTruthFileName);
    const submissionPath = path.resolve(__dirname, '../..', submission.filePath);

    const groundTruth = await loadCsv(groundTruthPath);
    const userPred = await loadCsv(submissionPath);

    if (userPred.length > 0) {
        const headers = Object.keys(userPred[0]);
        if (!headers.includes('id') || !headers.includes('pred')) {
            throw new Error('Submission CSV must contain "id" and "pred" columns');
        }
    }

    const gtMap = new Map();
    groundTruth.forEach(row => gtMap.set(String(row.id), parseFloat(row.y_true)));

    // --- DEBUGGING BLOCK ---
    const mapKeys = Array.from(gtMap.keys());
    // --- END DEBUGGING BLOCK ---

    const y_true = [];
    const y_pred = [];
    let matchesFound = 0;

    userPred.forEach((row, index) => {
        const rowId = String(row.id);

        if (gtMap.has(rowId)) {
            matchesFound++;
            const trueValue = gtMap.get(rowId);
            const predValue = parseFloat(row.pred);

            if (!isNaN(predValue)) {
                y_true.push(trueValue);
                y_pred.push(predValue);
            } else {
                throw new Error(`Invalid non-numeric value "${row.pred}" for id "${row.id}" in submission file.`);
            }
        }
    });

    if (y_true.length === 0) {
        throw new Error("Submission contains no matching IDs");
    }

    let score;
    switch (metric) {
        case "RMSE": score = calculateRMSE(y_true, y_pred); break;
        case "ACCURACY": score = calculateAccuracy(y_true, y_pred); break;
        case "ROC-AUC": score = calculateAUC(y_true, y_pred); break;
        case "F1": score = calculateF1Score(y_true, y_pred); break;
        default: throw new Error(`Unknown metric: ${metric}`);
    }

    const fileBuffer = fs.readFileSync(submissionPath);
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    return { score, hash, totalRows: y_pred.length, timestamp: Date.now() };
}

function loadCsv(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = fs.createReadStream(filePath);
        stream.on('error', (err) => reject(err));

        stream
            .pipe(csvParser({
                bom: true,
                mapHeaders: ({ header }) => header.trim().toLowerCase()
            }))
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
}

function calculateRMSE(y_true, y_pred) {
    let sum = 0;
    for (let i = 0; i < y_true.length; i++) {
        const diff = y_pred[i] - y_true[i]; // The error for one prediction
        sum += diff * diff;                 // Square the error
    }
    return Math.sqrt(sum / y_true.length);  // The square root of the average
}

function calculateAccuracy(y_true, y_pred) {
    let correct = 0;
    for (let i = 0; i < y_true.length; i++) {
        if (Math.round(y_pred[i]) === y_true[i]) {
            correct++;
        }
    }
    return correct / y_true.length;
}

function calculateAUC(y_true, y_pred) {
    const pairs = y_true.map((y, i) => ({ y, pred: y_pred[i] }));
    pairs.sort((a, b) => b.pred - a.pred);

    let tp = 0;
    let fp = 0;
    let auc = 0;

    const P = y_true.filter(v => v === 1).length;
    const N = y_true.filter(v => v === 0).length;

    if (P === 0 || N === 0) {
        return 0.5;
    }

    for (const p of pairs) {
        if (p.y === 1) {
            tp++;
        } else {
            fp++;
            auc += tp;
        }
    }

    return auc / (P * N);
}

function calculateF1Score(y_true, y_pred) {
    let tp = 0; // True Positives
    let fp = 0; // False Positives
    let fn = 0; // False Negatives

    for (let i = 0; i < y_true.length; i++) {
        const trueLabel = y_true[i];
        const predLabel = Math.round(y_pred[i]); // Округлюємо прогноз (0.7 -> 1, 0.4 -> 0)

        if (predLabel === 1 && trueLabel === 1) {
            tp++;
        } else if (predLabel === 1 && trueLabel === 0) {
            fp++;
        } else if (predLabel === 0 && trueLabel === 1) {
            fn++;
        }
    }

    const precision = tp / (tp + fp);
    const recall = tp / (tp + fn);

    if (isNaN(precision) || isNaN(recall) || (precision + recall) === 0) {
        return 0.0; // Уникаємо ділення на нуль
    }

    const f1 = 2 * (precision * recall) / (precision + recall);
    return f1;
}