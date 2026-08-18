import Category from "./category.model.js";

/* Create Category */
const createCategory = async (name, userId) => {
  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name,
    createdBy: userId,
  });

  return category;
};


/* Get All Categories */
const getAllCategories = async () => {
  const categories = await Category.find()
    .populate("createdBy", "firstName lastName role")
    .sort({ name: 1 });

  return categories;
};

export {
  createCategory,
  getAllCategories,
};