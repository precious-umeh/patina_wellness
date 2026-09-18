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
  console.error("Missing required environment variables:");

  missing.forEach((key) => {
    console.error(` - ${key}`);
  });

  process.exit(1);
}

export const env = {
  port: Number(process.env.PORT) || 5500,

  mongoUrl: process.env.MONGODB_URL,

  jwtSecret: process.env.JWT_SECRET,
  tokenTimeout: process.env.TOKEN_TIMEOUT,

  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  adminEmail: process.env.ADMIN_EMAIL,

  frontendUrl: process.env.FRONTEND_URL.replace(/\/$/, ""),

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};
