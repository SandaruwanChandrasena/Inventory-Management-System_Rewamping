import api from "./api";

// Login
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

// Logout
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

// Get current user's profile
export const getCurrentUser = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};

// Request a password reset email
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });

  return response.data;
};

// Reset password using the token from the email link
export const resetPassword = async (token, newPassword) => {
  const response = await api.put(`/auth/reset-password/${token}`, {
    newPassword,
  });

  return response.data;
};