import Category from "./category.model.js";

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

export { createCategory };