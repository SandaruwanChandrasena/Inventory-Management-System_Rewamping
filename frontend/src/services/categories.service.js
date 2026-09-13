import api from "./api";

/* Get all categories */
const getAllCategories = async () => {
  const response = await api.get("/products/categories");
  return response.data;
};

/* Create a new category */
const createCategory = async (name) => {
  const response = await api.post("/products/categories", { name });
  return response.data;
};

/* Update an existing category */
const updateCategory = async (categoryId, name) => {
  const response = await api.put(`/products/categories/${categoryId}`, {
    name,
  });
  return response.data;
};

/* Delete a category */
const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/products/categories/${categoryId}`);
  return response.data;
};

export { getAllCategories, createCategory, updateCategory, deleteCategory };