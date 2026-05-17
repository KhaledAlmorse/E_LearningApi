import asyncHandler from "express-async-handler";
import Category from "../../DB/models/category.model.js";

//* @desc    Get all categories
export const GetAllCategories = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const categories = await Category.find({ isActive: true })
    .skip(skip)
    .limit(limit);

  if (categories.length === 0) {
    return next(new Error("No categories found", { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    count: categories.length,
    categories,
  });
});

//* @desc    Get category by id
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findOne({ _id: id, isActive: true });

  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    category,
  });
});

//* @desc    Create new category
export const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create({ ...req.body });
  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

//* @desc    Update category for admin
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

//* @desc    Delete category for admin
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
