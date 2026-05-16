import express from "express";
import * as userService from "./user.service.js";
import isAuthenticated from "../../middlware/authentication.middlware.js";
import isAuthorized from "../../middlware/authorization.middlware.js";
import { endpoint } from "./user.endpoint.js";
import { uploadCloud } from "../../utils/upload/cloudMulter.js";
import * as userSchema from "./user.validaiton.js";
import validation from "../../middlware/validation.js";

const router = express.Router();

//* @route   GET /api/v1/user/myProfile
//* @desc    Get my profile
//* @access  Private (STUDENT, INSTRUCTOR, ADMIN)
router.get(
  "/myProfile",
  isAuthenticated,
  isAuthorized(endpoint.myProfile),
  userService.myProfile,
);

//* @route   POST /api/v1/user/logout
//* @desc    Logout user
//* @access  Private
router.post("/logout", isAuthenticated, userService.logout);

//* @route   POST /api/v1/user/profile-picture
//* @desc    Update profile picture
//* @access  Private
router.post(
  "/profile-picture",
  isAuthenticated,
  isAuthorized(endpoint.updateProfilePicture),
  uploadCloud().single("image"),
  userService.ProfilePicture,
);

//* @route   DELETE /api/v1/user/profile-picture
//* @desc    Delete profile picture
//* @access  Private
router.delete(
  "/profile-picture",
  isAuthenticated,
  isAuthorized(endpoint.deleteProfilePicture),
  userService.deleteProfilePicture,
);

//* @route   PUT /api/v1/user/profile
//* @desc    Update profile data
//* @access  Private
router.patch(
  "/profile",
  isAuthenticated,
  isAuthorized(endpoint.updateProfileData),
  validation(userSchema.updatedProfileDataValidation),
  userService.updateProfileData,
);

//* @route   PUT /api/v1/user/change-password
//* @desc    Change user password
//* @access  Private
router.patch(
  "/change-password",
  isAuthenticated,
  isAuthorized(endpoint.changePassword),
  validation(userSchema.changePasswordValidation),
  userService.changePassword,
);
export default router;
