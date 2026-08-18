import Category from "./category.model.js";

/* Create Category Service */
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

/* Get All Categories Service */
const getAllCategories = async () => {
  const categories = await Category.find()
    .populate("createdBy", "firstName lastName role")
    .populate("updatedBy", "firstName lastName role")
    .sort({ name: 1 });

  return categories;
};


/* Update Category Service */
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

/* Delete Category Service */

const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const deletedCategory = await Category.findByIdAndDelete(categoryId);

   

    return deletedCategory;
};

export {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};