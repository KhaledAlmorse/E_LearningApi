import { userRoles } from "../../DB/models/user.model.js";

const endpoint = {
  createCategory: [userRoles.ADMIN],
  updateCategory: [userRoles.ADMIN],
  deleteCategory: [userRoles.ADMIN],
};

export default endpoint;
