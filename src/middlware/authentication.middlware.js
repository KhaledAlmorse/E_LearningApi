import User from "../DB/models/user.model.js";
import { verifyToken } from "../utils/token/token.js";

const isAuthenticated = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return next(new Error("Unauthorized access", { cause: 401 }));
    }
    const token = req.headers.authorization.split(" ")[1];
    const { id } = verifyToken({ token });
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return next(new Error("Unauthorized access", { cause: 401 }));
    }

    if (!user.isLoggedIn) {
      return next(new Error("User is logged out", { cause: 401 }));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};

export default isAuthenticated;
