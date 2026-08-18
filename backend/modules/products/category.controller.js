import { createCategory, getAllCategories } from "./category.service.js";

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


export { createCategoryController, getAllCategoriesController };
