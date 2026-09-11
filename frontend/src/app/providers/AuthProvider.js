"use client";

import { createContext, useContext, useEffect, useState } from "react";
import server from "../lib/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isRequestingEmailChange, setIsRequestingEmailChange] = useState(false);
  const [isVerifyingEmailChange, setIsVerifyingEmailChange] = useState(false);

  const isAuthenticated = !!token;

  /**
   * =========================
   * Login
   * =========================
   */
  async function login(credentials) {
    try {
      setIsLoggingIn(true);

      const response = await server.post("/auth/login", credentials);

      const userData = response.data.user;
      const userToken = response.data.token;

      setUser(userData);
      setToken(userToken);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userToken);

      return {
        success: true,
        user: userData,
      };
    } catch (error) {
      console.error("Login Error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Login Failed.",
      };
    } finally {
      setIsLoggingIn(false);
    }
  }

  /**
   * =========================
   * Logout
   * =========================
   */
  async function logout() {
    try {
      await server.post("/auth/logout");
    } catch (error) {
      console.error("Backend Logout Failed:", error);
    } finally {
      setUser(null);
      setToken(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }

  /**
   * =========================
   * Get Current User
   * =========================
   */
  async function fetchMe() {
    try {
      const response = await server.get("/auth/profile");

      const userData = response.data.user;

      setUser(userData);

      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Session expired or Invalid token:", error);

      setUser(null);
      setToken(null);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }

  /**
   * =========================
   * Forgot Password
   * =========================
   */
  async function forgotPassword(email) {
    try {
      setLoading(true);

      const response = await server.post("/auth/forgot-password", { email });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Forgot Password Error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to process password reset request.",
      };
    } finally {
      setLoading(false);
    }
  }

  /**
   * =========================
   * Reset Password
   * =========================
   */
  async function resetPassword(token, newPassword) {
    try {
      setLoading(true);

      const response = await server.post("/auth/reset-password", {
        token,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Reset Password Error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Unable to reset password.",
      };
    } finally {
      setLoading(false);
    }
  }

  /**
   * =========================
   * Change Password
   * =========================
   */
  async function changePassword(currentPassword, newPassword) {
    try {
      setIsChangingPassword(true);

      const response = await server.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Changing Password Error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Unable to change password",
      };
    } finally {
      setIsChangingPassword(false);
    }
  }

  /**
   * =========================
   * Update Profile (Name & Avatar)
   * =========================
   */
  async function updateProfile(formData) {
    try {
      setIsUpdatingProfile(true);

      const response = await server.patch("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data.user;

      setUser(updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      return {
        success: true,
        user: updatedUser,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Updating Profile Error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Unable to update profile.",
      };
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  /**
   * =========================
   * Request Email Change
   * =========================
   */
  async function requestEmailChange(newEmail, currentPassword) {
    try {
      setIsRequestingEmailChange(true);

      const response = await server.post("/auth/change-email", {
        newEmail,
        currentPassword,
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Request Email Change Error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message || "Unable to request email change.",
      };
    } finally {
      setIsRequestingEmailChange(false);
    }
  }

  /**
   * =========================
   * Verify Email Change
   * =========================
   */
  async function verifyEmailChange(token) {
    try {
      setIsVerifyingEmailChange(true);

      const response = await server.post("/auth/verify-email-change", {
        token,
      });

      // Refresh user object after verified email change
      await fetchMe();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Verify Email Change Error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Invalid or expired email verification link.",
      };
    } finally {
      setIsVerifyingEmailChange(false);
    }
  }

  /**
   * =========================
   * Listen for unauthorized API responses
   * =========================
   */
  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setToken(null);
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  /**
   * =========================
   * Restore Authentication On Startup
   * =========================
   */
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem("token");

      const storedUser = localStorage.getItem("user");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem("user");
        }
      }

      // Verify that token is still valid
      await fetchMe();

      setLoading(false);
    }

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,

        loading,
        isLoggingIn,
        isChangingPassword,
        isUpdatingProfile,
        isRequestingEmailChange,
        isVerifyingEmailChange,

        isAuthenticated,

        login,
        logout,
        fetchMe,

        forgotPassword,
        resetPassword,
        changePassword,

        updateProfile,

        requestEmailChange,
        verifyEmailChange,

        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
