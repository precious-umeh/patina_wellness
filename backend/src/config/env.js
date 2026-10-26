import dotenv from "dotenv";

dotenv.config();

const required = [
  "MONGODB_URL",
  "JWT_SECRET",
  "TOKEN_TIMEOUT",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "ADMIN_EMAIL",
  "FRONTEND_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missing = required.filter((key) => !process.env[key]?.trim());

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

const nodeEnv = process.env.NODE_ENV || "development";
const port = Number(process.env.PORT || 5500);
const frontendUrlInput = process.env.FRONTEND_URL.trim();

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid port number between 1 and 65535");
}

if (!["development", "production", "test"].includes(nodeEnv)) {
  throw new Error("NODE_ENV must be development, production, or test");
}

let frontendUrl;

try {
  const parsedUrl = new URL(frontendUrlInput);

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error();
  }

  if (parsedUrl.origin !== frontendUrlInput.replace(/\/$/, "")) {
    throw new Error();
  }

  frontendUrl = parsedUrl.origin;
} catch {
  throw new Error(
    "FRONTEND_URL must be valid origin, e.g http://localhost:3000",
  );
}

export const env = {
  nodeEnv,
  port,

  mongoUrl: process.env.MONGODB_URL,

  jwtSecret: process.env.JWT_SECRET,
  tokenTimeout: process.env.TOKEN_TIMEOUT,

  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  adminEmail: process.env.ADMIN_EMAIL,

  frontendUrl,

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};
