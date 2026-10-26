import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/user.js";

dotenv.config();

const createAdmin = async function () {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!mongoUrl) {
      throw new Error("MONGODB_URL is missing from .env");
    }

    if (!adminEmail) {
      throw new Error("ADMIN_EMAIL is missing from .env");
    }

    if (!adminPassword) {
      throw new Error("ADMIN_PASSWORD is missing from .env");
    }

    await mongoose.connect(mongoUrl);

    console.log("Connected to MongoDB");

    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log(
        `Admin already exists (${existingAdmin.email}). ` +
          "No new admin was created.",
      );

      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await User.create({
      name: "Patina Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      avatar: "",
    });

    console.log(`Admin created successfully: ${admin.email}`);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exitCode = 1;
  } finally {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        console.log("Database connection closed.");
      }
    } catch (error) {
      console.error("Error closing database connection:", error.message);
      process.exitCode = 1;
    }
  }
};

createAdmin();
