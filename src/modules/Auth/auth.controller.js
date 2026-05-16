import express from "express";
import * as authServices from "./auth.service.js";
import validation from "../../middlware/validation.js";
import * as authSchemas from "./auth.validation.js";
import isAuthenticated from "../../middlware/authentication.middlware.js";

const router = express.Router();

//* @route   POST /api/v1/auth/register
//* @desc    Register a new user
//* @access  Public
router.post(
  "/register",
  validation(authSchemas.registerValidation),
  authServices.register,
);

//* @route   POST /api/v1/auth/login
//* @desc    Login user and return JWT token
//* @access  Public
router.post(
  "/login",
  validation(authSchemas.loginValidation),
  authServices.login,
);

//* @route   POST /api/v1/auth/refresh-token
//* @desc    Refresh access token
//* @access  Public
router.post(
  "/refresh-token",
  validation(authSchemas.refreshTokenValidation),
  authServices.refreshToken,
);

//* @route   POST /api/v1/auth/verify-email
//* @desc    Verify user email
//* @access  Public

router.post(
  "/verify-email",
  validation(authSchemas.verifyEmailOTPValidation),
  authServices.verifyEmailOTP,
);

//* @route   POST /api/v1/auth/send-otp
//* @desc    Send OTP to email for verification or password reset
//* @access  Public

router.post(
  "/send-otp",
  validation(authSchemas.sendOTPValidation),
  authServices.sendOTP,
);

//* @route   POST /api/v1/auth/forgot-password
//* @desc    Send OTP to email for password reset
//* @access  Public
router.post(
  "/forgot-password",
  validation(authSchemas.forgotPasswordValidation),
  authServices.forgotPassword,
);

//* @route   POST /api/v1/auth/reset-password
//* @desc    Reset user password using OTP
//* @access  Public
router.post(
  "/reset-password",
  validation(authSchemas.resetPasswordValidation),
  authServices.resetPassword,
);
export default router;
