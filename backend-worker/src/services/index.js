import { connectDB } from "./services/db.js";
import { startQueueListener } from "./services/queueService.js";

const start = async () => {
    await connectDB();
    startQueueListener();
};

start();
