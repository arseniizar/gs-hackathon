import express from "express";

const app = express();
app.use(express.json());


let mockSubmission = {
    _id: "12345",
    filePath: "data/user_pred.csv"
};


app.get("/api/internal/submissions/next", (req, res) => {
    console.log("Worker requested next task");

    if (!mockSubmission) {
        return res.status(404).send(); // no tasks
    }
    const toReturn = mockSubmission;
    mockSubmission = null;

    return res.json(toReturn);
});


app.post("/api/internal/submissions/:id/result", (req, res) => {
    console.log("Worker returned result:", req.body);
    return res.json({ ok: true });
});


app.listen(8080, () => {
    console.log("Mock backend-core running on http://localhost:8080");
});
