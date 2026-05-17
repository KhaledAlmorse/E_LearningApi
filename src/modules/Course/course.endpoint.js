import { userRoles } from "../../DB/models/user.model.js";

const endpoint = {
  createCourse: [userRoles.INSTRUCTOR],
  getCourses: [userRoles.STUDENT, userRoles.INSTRUCTOR],
  getCourseBySlug: [userRoles.STUDENT, userRoles.INSTRUCTOR],
  updateCourse: [userRoles.INSTRUCTOR, userRoles.ADMIN],
  deleteCourse: [userRoles.INSTRUCTOR, userRoles.ADMIN],
  publishCourse: [userRoles.INSTRUCTOR, userRoles.ADMIN],
  archeiveCourse: [userRoles.INSTRUCTOR, userRoles.ADMIN],
};

export default endpoint;
