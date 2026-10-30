import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  let decoded;

  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (
    typeof decoded !== "object" ||
    typeof decoded.sub !== "string" ||
    !Number.isInteger(decoded.tokenVersion)
  ) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  try {
    const user = await User.findById(decoded.sub).select(
      "_id email role tokenVersion",
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    const currentTokenVersion = user.tokenVersion ?? 0;

    if (decoded.tokenVersion !== currentTokenVersion) {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};
