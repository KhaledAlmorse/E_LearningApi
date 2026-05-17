import joi from "joi";
import { isValidObjectId } from "../../middlware/validation.js";

export const getCategoryByIdValidation = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();

export const createCategoryValidation = joi
  .object({
    name: joi.string().max(100).required(),
    description: joi.string().max(500),
  })
  .required();

export const updateCategoryValidation = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    name: joi.string().max(100),
    description: joi.string().max(500),
  })
  .required();

export const deleteCategoryValidation = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();
