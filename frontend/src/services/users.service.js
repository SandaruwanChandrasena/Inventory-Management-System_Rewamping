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

// Create a new user
export const createUser = async (userData) => {
  const response = await api.post("/auth/users", userData);

  return response.data;
};

// Update a user
export const updateUserById = async (userId, updateData) => {
  const response = await api.put(`/auth/users/${userId}`, updateData);

  return response.data;
};