import api from "./api";

// Get all users
export const getAllUsers = async () => {
  const response = await api.get("/auth/users");

  return response.data;
};

// Get one user's details
export const getUserById = async (userId) => {
  const response = await api.get(`/auth/users/${userId}`);

  return response.data;
};