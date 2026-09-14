import Product from "../products/product.model.js";
import StockMovement from "../stock/stock.model.js";

const getLowStockProducts = async () => {
  const products = await Product.find({
    $expr: { $lte: ["$totalQty", "$lowStockThreshold"] },
  })
    .populate("category", "name")
    .sort({ totalQty: 1 });

  return products;
};

const getStockMovements = async ({ startDate, endDate, productId }) => {
  const query = {};

  if (productId) {
    query.product = productId;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      // include the whole end day, not just midnight
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  const movements = await StockMovement.find(query)
    .populate("product", "name key")
    .populate("createdBy", "firstName lastName email")
    .sort({ createdAt: -1 });

  return movements;
};

export default { getLowStockProducts, getStockMovements };