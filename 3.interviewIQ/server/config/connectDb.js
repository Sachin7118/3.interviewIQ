import dns from "dns";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Use Google's public DNS to bypass local DNS resolution issues
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let mongoServer;

const connectDb = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined");
        }

        await mongoose.connect(process.env.MONGODB_URL);
        console.log(`DataBase Connected to Atlas`);
    } catch (error) {
        console.error("MongoDB Atlas connection failed:", error.message);
        console.log("Falling back to local in-memory MongoDB...");
        
        try {
            mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log("Connected to local MongoDB Memory Server");
        } catch (fallbackError) {
            console.error("Failed to start local MongoDB:", fallbackError.message);
            process.exit(1);
        }
    }
};

export default connectDb