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
    const uncategorizedCategory =
      await getUncategorizedCategory(userId);

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

export default {
  createProduct,
  getAllProducts,
};