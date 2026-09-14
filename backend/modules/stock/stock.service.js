import Product from "../products/product.model.js";
import StockMovement from "./stock.model.js";

/* Stock In Service */
const stockIn = async (productId, quantity, reason, userId) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const previousQty = product.totalQty;
  const newQty = previousQty + quantity;

  product.totalQty = newQty;
  await product.save();

  const movement = await StockMovement.create({
    product: productId,
    type: "in",
    quantity,
    reason,
    previousQty,
    newQty,
    createdBy: userId,
  });

  return { product, movement };
};

/* Stock Out Service */
const stockOut = async (productId, quantity, reason, userId) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const previousQty = product.totalQty;

  if (quantity > previousQty) {
    throw new Error(
      `Not enough stock. Available: ${previousQty}, requested: ${quantity}`,
    );
  }

  const newQty = previousQty - quantity;

  product.totalQty = newQty;
  await product.save();

  const movement = await StockMovement.create({
    product: productId,
    type: "out",
    quantity,
    reason,
    previousQty,
    newQty,
    createdBy: userId,
  });

  return { product, movement };
};

/* Stock Adjustment Service */
const stockAdjustment = async (productId, newQty, reason, userId) => {
  if (newQty < 0) {
    throw new Error("Quantity cannot be negative");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const previousQty = product.totalQty;

  product.totalQty = newQty;
  await product.save();

  const movement = await StockMovement.create({
    product: productId,
    type: "adjustment",
    quantity: Math.abs(newQty - previousQty),
    reason,
    previousQty,
    newQty,
    createdBy: userId,
  });

  return { product, movement };
};

/* Get Stock Movement History Service */
const getStockHistory = async (productId) => {
  const movements = await StockMovement.find({ product: productId })
    .populate("createdBy", "firstName lastName role")
    .sort({ createdAt: -1 });

  return movements;
};

/* Get Low Stock Products Service */
const getLowStockProducts = async () => {
  const products = await Product.find({
    $expr: { $lte: ["$totalQty", "$lowStockThreshold"] },
  }).populate("category", "name");

  return products;
};

export default {
  stockIn,
  stockOut,
  stockAdjustment,
  getStockHistory,
  getLowStockProducts,
};
