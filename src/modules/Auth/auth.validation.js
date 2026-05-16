import joi from "joi";

export const registerValidation = joi
  .object({
    firstName: joi.string().max(50).required(),
    lastName: joi.string().max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

export const loginValidation = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  })
  .required();

export const refreshTokenValidation = joi
  .object({
    refreshToken: joi.string().required(),
  })
  .required();

export const verifyEmailOTPValidation = joi
  .object({
    otp: joi.string().length(6).alphanum().required(),
  })
  .required();

export const sendOTPValidation = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

export const forgotPasswordValidation = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

export const resetPasswordValidation = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).alphanum().required(),
    newPassword: joi.string().min(6).required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();
