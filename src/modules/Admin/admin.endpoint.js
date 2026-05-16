import { userRoles } from "../../DB/models/user.model.js";
import { RejectInstructorApplication } from "./admin.service.js";

export const endPoint = {
  GetAllUsers: [userRoles.ADMIN],
  GetUserById: [userRoles.ADMIN],
  UpdateUserById: [userRoles.ADMIN],
  freezeUserById: [userRoles.ADMIN],
  updateUserRole: [userRoles.ADMIN],
  DeleteUserById: [userRoles.ADMIN],
  ListInstructorApplicationsByStatus: [userRoles.ADMIN],
  ApproveInstructorApplication: [userRoles.ADMIN],
  RejectInstructorApplication: [userRoles.ADMIN],
};
