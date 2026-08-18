import Category from "./category.model.js";

const createCategory = async (name, userId) => {
  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name,
    createdBy: userId,
    updatedBy: userId,
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await Category.find()
    .populate("createdBy", "firstName lastName role")
    .populate("updatedBy", "firstName lastName role")
    .sort({ name: 1 });

  return categories;
};

const updateCategory = async (categoryId, name, userId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const existingCategory = await Category.findOne({
    name,
    _id: { $ne: categoryId },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  category.name = name;
  category.updatedBy = userId;

  await category.save();

  return category;
};

export {
  createCategory,
  getAllCategories,
  updateCategory,
};