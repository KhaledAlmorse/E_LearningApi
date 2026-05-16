import { userRoles } from "../../DB/models/user.model.js";

export const endPoint = {
  applyInstructor: [userRoles.STUDENT],
};
