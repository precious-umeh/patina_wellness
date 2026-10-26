import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async function () {
  await mongoose.connect(env.mongoUrl);
  console.log(`Database connected successfully.`);
};

export default connectDB;
