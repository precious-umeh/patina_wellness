import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

import { env } from "../config/env.js";
import { sendEmail } from "../config/mail.js";

import {
  resetPasswordTemplate,
  verifyEmailTemplate,
} from "../utils/emailTemplates.js";

const signToken = function (payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.tokenTimeout });
};

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const token = signToken({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "User logged in",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Error processing request.",
    });
  }
}

export async function logout(req, res) {
  return res.status(200).json({
    message: "User logged out successfully",
  });
}

export async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const matchedPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!matchedPassword) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res
        .status(400)
        .json({ message: "New password cannot be the same as the old one." });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Change Password Error:", error);

    return res.status(500).json({
      message: "Error updating password.",
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store the hashedToken
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 15 mins
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    // Token sent to the frontend
    const resetUrl = `${env.frontendUrl}/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your Patina password",
        html: resetPasswordTemplate(user.name, resetUrl),
      });
    } catch (error) {
      console.error("Password Reset Email Error:", error);
    }

    return res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      message: "Error processing password reset request.",
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required." });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    // Hash token received from frontend
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with a matching token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 12);

    // Invalidate reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({ message: "Error resetting password." });
  }
}

export async function getUserProfile(req, res) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Get User Profile Error:", error);

    return res.status(500).json({
      message: "Error retrieving profile.",
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (name !== undefined) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          message: "Name cannot be empty.",
        });
      }

      user.name = trimmedName;
    }

    if (req.file) {
      user.avatar = req.file.path;
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: userResponse,
    });
  } catch (error) {
    console.error("Updating profile Error:", error);

    return res.status(500).json({
      message: "Error updating profile.",
    });
  }
}

export async function requestEmailChange(req, res) {
  try {
    const userId = req.user.id;
    const { newEmail, currentPassword } = req.body;

    if (!newEmail || !currentPassword) {
      return res.status(400).json({
        message: "New email and current password are required.",
      });
    }

    const normalizedEmail = newEmail.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    if (normalizedEmail === user.email) {
      return res.status(400).json({
        message: "New email is the same as your current email.",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already in use.",
      });
    }

    const emailChangeToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(emailChangeToken)
      .digest("hex");

    user.pendingEmail = normalizedEmail;
    user.emailChangeToken = hashedToken;

    user.emailChangeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const verificationUrl = `${env.frontendUrl}/verify-email-change?token=${emailChangeToken}`;

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "Verify new Patina Email Address",
        html: verifyEmailTemplate(user.name, normalizedEmail, verificationUrl),
      });
    } catch (error) {
      console.error("Verify Password Email Error:", error);
    }

    return res.status(200).json({
      message: "A verification link has been sent to your new email address.",
    });
  } catch (error) {
    console.error("Request Email Change Error:", error);

    return res.status(500).json({
      message: "Error processing email change request.",
    });
  }
}

export async function verifyEmailChange(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailChangeToken: hashedToken,
      emailChangeExpiresAt: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token.",
      });
    }

    const existingUser = await User.findOne({
      email: user.pendingEmail,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "This email is already in use.",
      });
    }

    user.email = user.pendingEmail;

    user.pendingEmail = null;
    user.emailChangeToken = null;
    user.emailChangeExpiresAt = null;

    await user.save();

    return res.status(200).json({
      message: "Email address updated successfully.",
    });
  } catch (error) {
    console.error("Verify Email Change Error:", error);

    return res.status(500).json({
      message: "Error verifying email change.",
    });
  }
}
