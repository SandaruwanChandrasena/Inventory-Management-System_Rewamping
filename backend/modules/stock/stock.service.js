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
      `Not enough stock. Available: ${previousQty}, requested: ${quantity}`
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

export default {
  stockIn,
  stockOut,
};