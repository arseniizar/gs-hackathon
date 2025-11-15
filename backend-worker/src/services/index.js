import { connectDB } from "./db.js";
import { startQueueListener } from "./queueService.js";


const start = async () => {
    await connectDB();
    startQueueListener();
};

start();
