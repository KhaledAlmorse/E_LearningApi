import joi from "joi";
import { isValidObjectId } from "../../middlware/validation.js";
import { userRoles } from "../../DB/models/user.model.js";

export const ListPendingInstructorApplicationsValidation = joi
  .object({
    status: joi
      .string()
      .valid("pending", "approved", "rejected")
      .default("pending"),
  })
  .required();

export const GetUserByIdValidation = joi
  .object({
    userId: joi.custom(isValidObjectId).required(),
  })
  .required();

export const UpdateUserByIdValidation = joi
  .object({
    userId: joi.custom(isValidObjectId).required(),
    firstName: joi.string().max(50),
    lastName: joi.string().max(50),
    email: joi.string().email(),
  })
  .required();

export const freezeUserByIdValidation = joi
  .object({
    userId: joi.custom(isValidObjectId).required(),
    freezed: joi.boolean().required(),
  })
  .required();

export const userRolesValidation = joi
  .object({
    userId: joi.custom(isValidObjectId).required(),
    role: joi
      .string()
      .valid(...Object.values(userRoles))
      .required(),
  })
  .required();

export const DeleteUserByIdValidation = joi
  .object({
    userId: joi.custom(isValidObjectId).required(),
  })
  .required();

export const ApproveInstructorApplicationValidation = joi
  .object({
    applicationId: joi.custom(isValidObjectId).required(),
  })
  .required();

export const RejectInstructorApplicationValidation = joi
  .object({
    applicationId: joi.custom(isValidObjectId).required(),
    rejectedReason: joi.string().max(200).required(),
  })
  .required();
