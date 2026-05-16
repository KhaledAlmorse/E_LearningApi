import express from "express";
import * as adminServices from "./admin.service.js";
import * as adminSchemas from "./admin.validation.js";
import validation from "../../middlware/validation.js";
import isAuthenticated from "../../middlware/authentication.middlware.js";
import isAuthorized from "../../middlware/authorization.middlware.js";
import { endPoint } from "./admin.endpoint.js";

const router = express.Router();

router.get(
  "/AllUsers",
  isAuthenticated,
  isAuthorized(endPoint.GetAllUsers),
  adminServices.GetAllUsers,
);

router.get(
  "/users/:userId",
  isAuthenticated,
  isAuthorized(endPoint.GetUserById),
  validation(adminSchemas.GetUserByIdValidation),
  adminServices.GetUserById,
);

router.patch(
  "/users/:userId",
  isAuthenticated,
  isAuthorized(endPoint.UpdateUserById),
  validation(adminSchemas.UpdateUserByIdValidation),
  adminServices.UpdateUserById,
);

router.patch(
  "/users/:userId/status",
  isAuthenticated,
  isAuthorized(endPoint.freezeUserById),
  validation(adminSchemas.freezeUserByIdValidation),
  adminServices.updateUserStatus,
);
router.patch(
  "/users/:userId/role",
  isAuthenticated,
  isAuthorized(endPoint.updateUserRole),
  validation(adminSchemas.userRolesValidation),
  adminServices.updateUserRole,
);

router.delete(
  "/users/:userId",
  isAuthenticated,
  isAuthorized(endPoint.DeleteUserById),
  validation(adminSchemas.DeleteUserByIdValidation),
  adminServices.DeleteUserById,
);

router.get(
  "/instructors/:status",
  isAuthenticated,
  isAuthorized(endPoint.ListPendingInstructorApplications),
  validation(adminSchemas.ListPendingInstructorApplicationsValidation),
  adminServices.ListPendingInstructorApplications,
);

router.patch(
  "/instructors/:applicationId/approve",
  isAuthenticated,
  isAuthorized(endPoint.ApproveInstructorApplication),
  validation(adminSchemas.ApproveInstructorApplicationValidation),
  adminServices.ApproveInstructorApplication,
);

router.patch(
  "/instructors/:applicationId/reject",
  isAuthenticated,
  isAuthorized(endPoint.RejectInstructorApplication),
  validation(adminSchemas.RejectInstructorApplicationValidation),
  adminServices.RejectInstructorApplication,
);

export default router;
