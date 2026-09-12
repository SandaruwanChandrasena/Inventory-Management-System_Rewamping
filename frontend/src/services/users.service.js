import api from "./api";

// Get all users
export const getAllUsers = async () => {
  const response = await api.get("/auth/users");

  return response.data;
};