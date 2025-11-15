import { test, describe, it, before } from 'node:test';
import assert from 'node:assert';
import { scoreSubmission } from '../services/scoringService.js';
import fs from 'fs';

const createSubmission = (filePath, type) => ({
    filePath,
    metric: type,
});

describe('Scoring Service Tests', () => {

    describe('Accuracy Metric', () => {
        const submissionType = 'ACCURACY';

        it('should return 1.0 for a perfect submission', async () => {
            const submission = createSubmission('test-submissions/accuracy_perfect.csv', submissionType);
            const result = await scoreSubmission(submission, 'ground_truth_accuracy.csv');
            assert.strictEqual(result.score, 1.0, 'Perfect score should be 1.0');
        });

        it('should return 0.75 for a submission with 6/8 correct answers', async () => {
            const submission = createSubmission('test-submissions/accuracy_good.csv', submissionType);
            const result = await scoreSubmission(submission, 'ground_truth_accuracy.csv');
            assert.strictEqual(result.score, 0.75, 'Score should be 0.75');
        });

        it('should ignore extra rows in submission', async () => {
            const submission = createSubmission('test-submissions/accuracy_extra_rows.csv', submissionType);
            const result = await scoreSubmission(submission, 'ground_truth_accuracy.csv');
            assert.strictEqual(result.score, 1.0, 'Extra rows should be ignored');
        });

        it('should handle missing rows gracefully', async () => {
            const submission = createSubmission('test-submissions/accuracy_missing_rows.csv', submissionType);
            const result = await scoreSubmission(submission, 'ground_truth_accuracy.csv');
            assert.strictEqual(result.score, 1.0, 'Score should be calculated on available rows');
            assert.strictEqual(result.totalRows, 4, 'Total rows should be 4');
        });
    });

    describe('RMSE Metric', () => {
        const submissionType = 'RMSE';

        it('should return 0.0 for a perfect submission', async () => {
            const submission = createSubmission('test-submissions/rmse_perfect.csv', submissionType);
            const result = await scoreSubmission(submission, 'ground_truth_rmse.csv');
            assert.strictEqual(result.score, 0.0, 'Perfect RMSE score should be 0.0');
        });

        it('should return a positive score for a good submission', async () => {
            const submission = createSubmission('test-submissions/rmse_good.csv', submissionType);
            const result = await scoreSubmission(submission, 'ground_truth_rmse.csv');
            assert.ok(result.score > 0, 'RMSE should be a positive number');
            // Calculated RMSE for rmse_good.csv is approx 8.32
            assert.ok(Math.abs(result.score - 7.905) < 0.001, `RMSE score is incorrect. Expected ~7.905, got ${result.score}`);
        });
    });

    describe('ROC-AUC Metric', () => {
        const submissionType = 'AUC';
        const gtFile = 'ground_truth_auc.csv';

        it('should return 1.0 for a perfect submission', async () => {
            const submission = createSubmission('test-submissions/auc_perfect.csv', submissionType);
            const result = await scoreSubmission(submission, 'ground_truth_auc.csv');
            assert.strictEqual(result.score, 1.0, 'Perfect AUC score should be 1.0');
        });

        it('should return a specific value for a semi-random submission', async () => {
            const sub = createSubmission('test-submissions/auc_random.csv', submissionType);
            const result = await scoreSubmission(sub, gtFile);
            assert.strictEqual(result.score, 0.0, "AUC for this specific 'random' set should be 0.0");
        });

        it('should return 0.0 for a perfectly inverted submission', async () => {
            const submission = createSubmission('test-submissions/auc_inverted.csv', submissionType);
            const result = await scoreSubmission(submission, 'ground_truth_auc.csv');
            assert.strictEqual(result.score, 0.0, 'Inverted AUC score should be 0.0');
        });
    });

    describe('Error Handling', () => {
        it('should throw an error for empty submissions', async () => {
            const submission = createSubmission('test-submissions/generic_empty.csv', 'ACCURACY');
            await assert.rejects(
                () => scoreSubmission(submission, 'ground_truth_accuracy.csv'),
                { message: 'Submission contains no matching IDs' }
            );
        });

        it('should throw an error for submissions with no matching IDs', async () => {
            const submission = createSubmission('test-submissions/generic_no_matching_ids.csv', 'ACCURACY');
            await assert.rejects(
                () => scoreSubmission(submission, 'ground_truth_accuracy.csv'),
                { message: 'Submission contains no matching IDs' }
            );
        });

        it('should throw an error for files with wrong column names', async () => {
            const submission = createSubmission('test-submissions/accuracy_wrong_columns.csv', 'ACCURACY');
            await assert.rejects(
                () => scoreSubmission(submission, 'ground_truth_accuracy.csv'),
                { message: 'Submission CSV must contain "id" and "pred" columns' }
            );
        });
    });
});