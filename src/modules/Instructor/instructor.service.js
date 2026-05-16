import asynchandler from "express-async-handler";
import InstructorApplication from "../../DB/models/instructorApplication.model.js";
import User from "../../DB/models/user.model.js";

//* apply to be a instructor

export const applyInstructor = asynchandler(async (req, res, next) => {
  const student = await User.findById(req.user._id);
  if (!student) {
    return next(new Error("Student not found", { cause: 404 }));
  }

  //* Check if the student has already applied to be an instructor

  const existingApp = await InstructorApplication.findOne({
    userId: student._id,
  });
  if (existingApp) {
    return next(
      new Error("You have already applied to be an instructor", { cause: 400 }),
    );
  }

  const instructorApp = await InstructorApplication.create({
    ...req.body,
    userId: student._id,
  });

  return res.status(201).json({
    success: true,
    message: "Instructor application submitted successfully",
    data: instructorApp,
  });
});
