import productService from "./product.service.js";

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(
      req.body,
      req.user._id
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createProduct,
  getAllProducts,
};