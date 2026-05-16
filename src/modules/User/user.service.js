import asynchandler from "express-async-handler";
import User, {
  defulatPublic_Id,
  defulatSecure_Url,
} from "../../DB/models/user.model.js";
import cloudinary from "../../utils/upload/cloudinary.config.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
// import e from "express";

//* @route   POST /api/v1/user/profile-picture
export const myProfile = asynchandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  res.status(200).json({ success: true, data: user });
});

//* @desc    Logout user
export const logout = asynchandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  user.isLoggedIn = false;
  await user.save();
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
});

//* @desc    Update profile picture
export const ProfilePicture = asynchandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/users/${user.firstName}_${user.id}/ProfilePictures`,
    },
  );

  user.profilePicture = { secure_url, public_id };
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
    data: user,
  });
});

//* @desc    Delete profile picture
export const deleteProfilePicture = asynchandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const result = await cloudinary.uploader.destroy(
    user.profilePicture.public_id,
  );
  if (result.result !== "ok") {
    return next(new Error("Failed to delete profile picture", { cause: 500 }));
  }

  if (result.result === "ok") {
    user.profilePicture = {
      secure_url: defulatSecure_Url,
      public_id: defulatPublic_Id,
    };
    await user.save();
  }

  return res.status(200).json({
    success: true,
    message: "Profile picture deleted successfully",
    data: user,
  });
});

//* @desc updated profile data
export const updateProfileData = asynchandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    success: true,
    message: "Profile data updated successfully",
    data: updatedUser,
  });
});

//* @desc Update User Password
export const changePassword = asynchandler(async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (!compareHash({ plainText: oldPassword, hash: user.password })) {
    return next(new Error("Old password is incorrect", { cause: 400 }));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { password: hash({ plainText: newPassword }), isLoggedIn: false },
    { new: true, runValidators: true },
  );
  res.status(200).json({
    success: true,
    message: "Password updated successfully, please login again",
    data: updatedUser,
  });
});
