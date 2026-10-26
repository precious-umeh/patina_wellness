import { rateLimit } from "express-rate-limit";

const createLimiter = ({
  windowMs,
  limit,
  message,
  skipSuccessfulRequests = false,
}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    message: {
      success: false,
      message,
    },
  });

// Admin login
export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  message: "Too many login attempts. Please try again in 15 minutes.",
});

// Password recovery
export const forgotPasswordLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: "Too many password-reset requests. Please try again later.",
});

export const resetPasswordLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many password-reset attempts. Please try again in 15 minutes.",
});

// Email verification
export const verifyEmailChangeLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many verification attempts. Please try again in 15 minutes.",
});

// Email change
export const changeEmailLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: "Too many email-change requests. Please try again later.",
});

// Forms
export const bookingLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many booking submissions. Please try again in 15 minutes.",
});

export const inquiryLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many inquiry submissions. Please try again in 15 minutes.",
});

export const partnershipLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many partnership submissions. Please try again in 15 minutes.",
});
