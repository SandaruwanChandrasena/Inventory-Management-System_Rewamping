import api from "./api";

// Get current user's profile
export const getProfile = async () => {
  const response = await api.get("/auth/profile");

  return response.data;
};

// Update current user's profile
export const updateProfile = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);

  return response.data;
};