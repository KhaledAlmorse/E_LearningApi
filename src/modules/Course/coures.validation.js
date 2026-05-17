import joi from "joi";
import { isValidObjectId } from "../../middlware/validation.js";
import {
  defulatPublic_Id,
  defulatSecure_Url,
} from "../../DB/models/user.model.js";

export const createCourseValidation = joi
  .object({
    title: joi.string().max(200).required(),
    description: joi.string().max(5000).required(),
    shortDescription: joi.string().max(300),
    // instructor: joi.custom(isValidObjectId).required(),
    category: joi.custom(isValidObjectId).required(),
    subcategory: joi.custom(isValidObjectId),
    price: joi.number().min(0).required(),
    thumbnail: joi.object({
      secure_url: joi.string().default(defulatSecure_Url),
      public_id: joi.string().default(defulatPublic_Id),
    }),
    discountPrice: joi.number().min(0),
  })
  .required();

export const updateCourseValidation = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    title: joi.string().max(200),
    description: joi.string().max(5000),
    shortDescription: joi.string().max(300),
    category: joi.custom(isValidObjectId),
    subcategory: joi.custom(isValidObjectId),
    price: joi.number().min(0),
    thumbnail: joi.object({
      secure_url: joi.string().default(defulatSecure_Url),
      public_id: joi.string().default(defulatPublic_Id),
    }),
    discountPrice: joi.number().min(0),
  })
  .required();

export const deleteCourseValidation = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();

export const publishCourseValidation = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();

export const archiveCourseValidation = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();
