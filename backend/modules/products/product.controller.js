import productService from "./product.service.js";

/* Create Product Controller */
const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

/* Get All Products Controller */
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

/* Get Product By Id Controller */
const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.productId);

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/* Update Product Controller */
const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      req.params.productId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

/* Delete Product Controller */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(
      req.params.productId
    );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

/* Upload Product Image Controller */
const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const product = await productService.uploadProductImage(
      req.params.productId,
      req.file,
    );

    return res.status(200).json({
      success: true,
      message: "Product image uploaded successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

/* Delete Product Image Controller */
const deleteProductImage = async (req, res, next) => {
  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: "Image path is required",
      });
    }

    const product = await productService.deleteProductImage(
      req.params.productId,
      imagePath,
    );

    return res.status(200).json({
      success: true,
      message: "Product image deleted successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
};