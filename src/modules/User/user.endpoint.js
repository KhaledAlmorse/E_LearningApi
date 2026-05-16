import { userRoles } from "../../DB/models/user.model.js";

export const endpoint = {
  myProfile: [userRoles.STUDENT, userRoles.INSTRUCTOR, userRoles.ADMIN],
  updateProfilePicture: [
    userRoles.STUDENT,
    userRoles.INSTRUCTOR,
    userRoles.ADMIN,
  ],
  deleteProfilePicture: [
    userRoles.STUDENT,
    userRoles.INSTRUCTOR,
    userRoles.ADMIN,
  ],
  updateProfileData: [userRoles.STUDENT, userRoles.INSTRUCTOR, userRoles.ADMIN],
  changePassword: [userRoles.STUDENT, userRoles.INSTRUCTOR, userRoles.ADMIN],
};
