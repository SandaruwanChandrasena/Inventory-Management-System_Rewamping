import api from "./api";

// Get current user's profile
export const getProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};