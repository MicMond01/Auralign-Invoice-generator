import mongoose from "mongoose";
import config from "./index";
import logger from "../utils/logger";

class Database {
  private static instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      const mongoUri =
        config.env === "test" ? config.mongodb.testUri : config.mongodb.uri;

      mongoose.set("strictQuery", false);

      await mongoose.connect(mongoUri);

      logger.info(`MongoDB Connected: ${mongoose.connection.host}`);

      mongoose.connection.on("error", (err) => {
        logger.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected");
      });

      process.on("SIGINT", async () => {
        await this.disconnect();
        process.exit(0);
      });
    } catch (error) {
      logger.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed");
    } catch (error) {
      logger.error("Error disconnecting from MongoDB:", error);
      throw error;
    }
  }

  public getConnection() {
    return mongoose.connection;
  }
}

export default Database.getInstance();
