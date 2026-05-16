import joi from "joi";

export const updatedProfileDataValidation = joi
  .object({
    firstName: joi.string().min(2).max(30).required(),
    lastName: joi.string().min(2).max(30).required(),
    bio: joi.string().max(500),
  })
  .required();

export const changePasswordValidation = joi
  .object({
    oldPassword: joi.string().min(6).max(100).required(),
    newPassword: joi.string().min(6).max(100).required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();
