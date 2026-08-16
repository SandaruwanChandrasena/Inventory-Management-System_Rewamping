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