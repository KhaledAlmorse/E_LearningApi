import connectDB from "../DB/db.Connections.js";
import { globalErrorHandling } from "../utils/errorHandling/globalErrorHandling.js";
import { notFoundErrorHandling } from "../utils/errorHandling/notFoundErrorHandling.js";
import authRoutes from "./Auth/auth.controller.js";
import userRoutes from "./User/user.controller.js";
import adminRoutes from "./Admin/admin.controller.js";
import instructorRoutes from "./Instructor/instructor.controller.js";
import categoryRoutes from "./Category/category.controller.js";
import courseRoutes from "./Course/course.controller.js";

const bootstrap = async (app, express) => {
  await connectDB();

  app.use(express.json());

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/admin", adminRoutes);
  app.use("/api/v1/instructor", instructorRoutes);
  app.use("/api/v1/category", categoryRoutes);
  app.use("/api/v1/courses", courseRoutes);

  app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to E-Learning API" });
  });
  app.use(globalErrorHandling);
  app.use("*name", notFoundErrorHandling);
};

export default bootstrap;
