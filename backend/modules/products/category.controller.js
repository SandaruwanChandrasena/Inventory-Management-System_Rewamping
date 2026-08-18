import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "./category.service.js";

/* Create Category Controller */
const createCategoryController = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await createCategory(name, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

/* Get All Categories Controller */
const getAllCategoriesController = async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

/* Update Category Controller */
const updateCategoryController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await updateCategory(categoryId, name, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

/* Delete Category Controller */
const deleteCategoryController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const deletedCategory = await deleteCategory(categoryId);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
};
