import api from "./api";

/* Add stock to a product */
const stockIn = async (productId, quantity, reason) => {
  const response = await api.post(`/stock/${productId}/in`, {
    quantity,
    reason,
  });
  return response.data;
};

/* Remove stock from a product */
const stockOut = async (productId, quantity, reason) => {
  const response = await api.post(`/stock/${productId}/out`, {
    quantity,
    reason,
  });
  return response.data;
};

/* Set a product's quantity to an exact new value */
const stockAdjustment = async (productId, newQty, reason) => {
  const response = await api.put(`/stock/${productId}/adjustment`, {
    newQty,
    reason,
  });
  return response.data;
};

/* Get the movement history for one product */
const getStockHistory = async (productId) => {
  const response = await api.get(`/stock/${productId}/history`);
  return response.data;
};

/* Get all products currently at or below their low stock threshold */
const getLowStockProducts = async () => {
  const response = await api.get("/stock/low-stock");
  return response.data;
};

export {
  stockIn,
  stockOut,
  stockAdjustment,
  getStockHistory,
  getLowStockProducts,
};