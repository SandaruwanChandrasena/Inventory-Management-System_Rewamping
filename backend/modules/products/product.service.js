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

  // No category provided
  if (!category) {
    const uncategorizedCategory = await getUncategorizedCategory(userId);

    category = uncategorizedCategory._id;
  } else {
    // Category was provided, so check that it exists
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

export default {
  createProduct,
};