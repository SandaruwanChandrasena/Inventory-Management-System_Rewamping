import api from "./api";

/* Get all products */
const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

/* Get one product by id (includes signed image URLs) */
const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

/* Create a new product */
const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

/* Update an existing product */
const updateProduct = async (productId, productData) => {
  const response = await api.put(`/products/${productId}`, productData);
  return response.data;
};

/* Delete a product */
const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

/* Upload one product image (form-data, field name "productImage") */
const uploadProductImage = async (productId, file) => {
  const formData = new FormData();
  formData.append("productImage", file);

  const response = await api.put(`/products/${productId}/images`, formData);
  return response.data;
};

/* Delete one product image by its storage path */
const deleteProductImage = async (productId, imagePath) => {
  const response = await api.delete(`/products/${productId}/images`, {
    data: { imagePath },
  });
  return response.data;
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
};