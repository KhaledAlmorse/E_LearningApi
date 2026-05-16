import express from "express";
import * as instructorServices from "./instructor.service.js";
import * as instructorSchemas from "./instructor.validation.js";
import isAuthenticated from "../../middlware/authentication.middlware.js";
import isAuthorized from "../../middlware/authorization.middlware.js";
import validation from "../../middlware/validation.js";
import { endPoint } from "./instructor.endpoint.js";

const router = express.Router();

//* @route   POST /api/v1/instructor/apply-instructor
//* @desc    Apply to be an instructor
//* @access  Private (only for authenticated students)

router.post(
  "/apply-instructor",
  isAuthenticated,
  isAuthorized(endPoint.applyInstructor),
  validation(instructorSchemas.applyInstructorValidation),
  instructorServices.applyInstructor,
);

export default router;
