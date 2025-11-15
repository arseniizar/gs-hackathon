import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("[Worker] Connected to MongoDB");
    } catch (err) {
        console.error("[Worker] Mongo error:", err);
        process.exit(1);
    }
}
