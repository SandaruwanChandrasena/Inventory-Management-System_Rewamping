import Product from "./product.model.js";
import Category from "./category.model.js";

const getUncategorizedCategory = async (userId) => {
  let category = await Category.findOne({
    name: "Uncategorized",
  });

  if (!category) {
    category = await Category.create({
      name: "Uncategorized",
      createdBy: userId,
      updatedBy: userId,
    });
  }

  return category;
};

const createProduct = async (productData, userId) => {
  let { category } = productData;

  if (!category) {
    const uncategorizedCategory = await getUncategorizedCategory(userId);

    category = uncategorizedCategory._id;
  } else {
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      throw new Error("Category not found");
    }
  }

  const product = await Product.create({
    ...productData,
    category,
  });

  return product;
};

const getAllProducts = async () => {
  const products = await Product.find()
    .populate("category", "name")
    .sort({ name: 1 });

  return products;
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate(
    "category",
    "name",
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const updateProduct = async (productId, updateData) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // If category is being changed,
  // make sure the new category exists.
  if (updateData.category) {
    const categoryExists = await Category.findById(updateData.category);

    if (!categoryExists) {
      throw new Error("Category not found");
    }
  }

  // Prevent key from being changed
  delete updateData.key;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).populate("category", "name");

  return updatedProduct;
};

const deleteProduct = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const deletedProduct = await Product.findByIdAndDelete(productId);

  return deletedProduct;
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};


