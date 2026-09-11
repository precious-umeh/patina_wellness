import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async function () {
  try {
    await mongoose.connect(env.mongoUrl);
    console.log(`Database connected successfully.`);
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

export default connectDB;
