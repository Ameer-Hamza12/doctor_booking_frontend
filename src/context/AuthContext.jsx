// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
          // Verify token by fetching current user
          const response = await authService.getCurrentUser();
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        // Clear invalid tokens
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register function
  const register = async (userData) => {
    setError(null);
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      return response;
    } catch (error) {
      // Pass backend validation errors
      setError(error.error || "Registration failed");
      throw error; // This allows Signup.jsx to catch and use err.errors
    }
  };

  // Login function
  const login = async (credentials) => {
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      return response;
    } catch (error) {
      setError(error.error || "Login failed");
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      setError(error.error || "Logout failed");
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const response = await authService.updateProfile(profileData);
      setUser(response.data);
      return response;
    } catch (error) {
      setError(error.error || "Failed to update profile");
      throw error;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    try {
      const response = await authService.changePassword(
        currentPassword,
        newPassword
      );
      return response;
    } catch (error) {
      setError(error.error || "Failed to change password");
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAuthenticated: authService.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
