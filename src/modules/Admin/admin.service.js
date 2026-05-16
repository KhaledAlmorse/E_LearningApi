import asynchandler from "express-async-handler";
import InstructorApplication, {
  applicationStatus,
} from "../../DB/models/instructorApplication.model.js";
import User from "../../DB/models/user.model.js";
import { request } from "express";

//* list all users for admin
export const GetAllUsers = asynchandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const users = await User.find().select("-password").limit(limit).skip(skip);

  return res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    count: users.length,
    data: users,
  });
});

//* Get user by id for admin */
export const GetUserById = asynchandler(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

//* Updated any user by id for admin */
export const UpdateUserById = asynchandler(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  }).select("-password");
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

//* update user freezed status by id for admin */
export const updateUserStatus = asynchandler(async (req, res, next) => {
  const userId = req.params.userId;
  const { freezed } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { freezed },
    { new: true },
  ).select("-password");
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  return res.status(200).json({
    success: true,
    message: "User freezed status updated successfully",
    data: user,
  });
});

export const updateUserRole = asynchandler(async (req, res, next) => {
  const userId = req.params.userId;
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true },
  ).select("-password");

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: user,
  });
});

export const DeleteUserById = asynchandler(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await User.findByIdAndDelete(userId).select("-password");

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

//* List pending applications for instructors
export const ListPendingInstructorApplications = asynchandler(
  async (req, res, next) => {
    const applications = await InstructorApplication.find({
      status: req.params.status || applicationStatus.PENDING,
    }).populate({
      path: "userId",
      select: "firstName lastName email profilePicture",
    });

    if (applications.length === 0) {
      return next(
        new Error("No pending instructor applications found", { cause: 404 }),
      );
    }

    return res.status(200).json({
      success: true,
      message: `${req.params.status} instructor applications retrieved successfully`,
      count: applications.length,
      data: applications,
    });
  },
);

//* Approve instructor application

export const ApproveInstructorApplication = asynchandler(
  async (req, res, next) => {
    const applicationId = req.params.applicationId;

    const application = await InstructorApplication.findByIdAndUpdate(
      applicationId,
      {
        status: applicationStatus.APPROVED,
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
      },
      { new: true },
    ).populate({
      path: "userId",
      select: "firstName lastName email profilePicture",
    });

    if (!application) {
      return next(
        new Error("Instructor application not found", { cause: 404 }),
      );
    }

    return res.status(200).json({
      success: true,
      message: "Instructor application approved successfully",
      data: application,
    });
  },
);

//* Reject instructor application

export const RejectInstructorApplication = asynchandler(
  async (req, res, next) => {
    const applicationId = req.params.applicationId;

    const application = await InstructorApplication.findByIdAndUpdate(
      applicationId,
      {
        status: applicationStatus.REJECTED,
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        rejectedReason: req.body.rejectedReason,
      },
      { new: true },
    ).populate({
      path: "userId",
      select: "firstName lastName email profilePicture",
    });

    if (!application) {
      return next(
        new Error("Instructor application not found", { cause: 404 }),
      );
    }

    return res.status(200).json({
      success: true,
      message: "Instructor application rejected successfully",
      data: application,
    });
  },
);
