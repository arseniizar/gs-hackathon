import { scoreSubmission } from "../services/scoringService.js";

async function test() {
    const submission = {
        filePath: "data/sample_submission.csv"
    };

    const result = await scoreSubmission(submission);

    console.log("TEST RESULT:");
    console.log(result);
}

test();
