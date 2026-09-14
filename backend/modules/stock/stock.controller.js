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

export { stockIn, stockOut };