import joi from "joi";
import { isValidObjectId } from "../../middlware/validation.js";

export const applyInstructorValidation = joi
  .object({
    bio: joi.string().max(1000).required(),
    expertise: joi.string().required(),
    linkedInUrl: joi
      .string()
      .pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/)
      .required(),
  })
  .required();
