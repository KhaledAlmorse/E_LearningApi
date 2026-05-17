import express from "express";
import isAuthenticated from "../../middlware/authentication.middlware.js";
import isAuthorized from "../../middlware/authorization.middlware.js";
import endPoint from "./category.endpoint.js";
import * as categoryServices from "./category.service.js";
import * as categorySchemas from "./category.validation.js";
import validation from "../../middlware/validation.js";

const router = express.Router();

//** @route GET /api/v1/category
//** @desc Get all categories
//** @access Public
router.get("/", categoryServices.GetAllCategories);
//** @route GET /api/v1/category/:id
//** @desc Get category by id
//** @access Public
router.get("/:id", categoryServices.getCategoryById);

//** @route POST /api/v1/category
//** @desc Create new category
//** @access Private (Admin only)
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoint.createCategory),
  validation(categorySchemas.createCategoryValidation),
  categoryServices.createCategory,
);

//** @route PATCH /api/v1/category/:id
//** @desc Update category by id
//** @access Private (Admin only)
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized(endPoint.updateCategory),
  validation(categorySchemas.updateCategoryValidation),
  categoryServices.updateCategory,
);

//** @route DELETE /api/v1/category/:id
//** @desc Delete category by id
//** @access Private (Admin only)
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized(endPoint.deleteCategory),
  validation(categorySchemas.deleteCategoryValidation),
  categoryServices.deleteCategory,
);

export default router;
