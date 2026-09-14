import stockService from "./stock.service.js";

/* Stock In Controller */
const stockIn = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;

    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    const result = await stockService.stockIn(
      req.params.productId,
      quantity,
      reason,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: "Stock added successfully",
      product: result.product,
      movement: result.movement,
    });
  } catch (error) {
    next(error);
  }
};

/* Stock Out Controller */
const stockOut = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;

    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    const result = await stockService.stockOut(
      req.params.productId,
      quantity,
      reason,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: "Stock removed successfully",
      product: result.product,
      movement: result.movement,
    });
  } catch (error) {
    next(error);
  }
};

/* Stock Adjustment Controller */
const stockAdjustment = async (req, res, next) => {
  try {
    const { newQty, reason } = req.body;

    if (newQty === undefined) {
      return res.status(400).json({
        success: false,
        message: "newQty is required",
      });
    }

    const result = await stockService.stockAdjustment(
      req.params.productId,
      newQty,
      reason,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      message: "Stock adjusted successfully",
      product: result.product,
      movement: result.movement,
    });
  } catch (error) {
    next(error);
  }
};

/* Get Stock Movement History Controller */
const getStockHistory = async (req, res, next) => {
  try {
    const movements = await stockService.getStockHistory(
      req.params.productId,
    );

    return res.status(200).json({
      success: true,
      count: movements.length,
      movements,
    });
  } catch (error) {
    next(error);
  }
};

/* Get Low Stock Products Controller */
const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await stockService.getLowStockProducts();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export { stockIn, stockOut, stockAdjustment, getStockHistory, getLowStockProducts };