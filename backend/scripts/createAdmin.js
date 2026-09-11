import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/user.js";

dotenv.config();

const createAdmin = async function () {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is missing from .env");
    }

    if (!process.env.ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is missing from .env");
    }

    if (!process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_PASSWORD is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URL);

    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log(
        `Admin already exists (${existingAdmin.email}). ` +
          "The create-admin script can only be used once.",
      );

      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    const admin = await User.create({
      name: "Patina Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      avatar: "",
    });

    console.log(`Admin created successfully: ${admin.email}`);
  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

createAdmin();
