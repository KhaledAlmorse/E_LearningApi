import express from "express";

import * as courseService from "./course.service.js";
import isAuthorized from "../../middlware/authorization.middlware.js";
import isAuthenticated from "../../middlware/authentication.middlware.js";
import * as CourseSchema from "./coures.validation.js";
import validation from "../../middlware/validation.js";
import endpoint from "./course.endpoint.js";
import { uploadCloud } from "../../utils/upload/cloudMulter.js";

const router = express.Router();

//* @route POST /api/courses
//* @desc Create a new course (instructor only)
//* @access Private
router.post(
  "/",
  isAuthenticated,
  isAuthorized(endpoint.createCourse),
  uploadCloud().single("thumbnail"),
  validation(CourseSchema.createCourseValidation),
  courseService.createCourse,
);

//* @route GET /api/courses
//* @desc Get all courses with pagination and filtering
//* @access Public
router.get(
  "/",
  //   isAuthenticated,
  //   isAuthorized(endpoint.getCourses),
  courseService.getCourses,
);

//* @route GET /api/courses/myCourses
//* @desc Get courses of logged in instructor
//* @access Private
router.get("/myCourses", isAuthenticated, courseService.MyCourses);

//* @route GET /api/courses/:slug
//* @desc Get a single course by slug
//* @access Public
router.get(
  "/:slug",
  //   isAuthenticated,
  //   isAuthorized(endpoint.getCourseBySlug),
  courseService.getCourseBySlug,
);

//* @route PATCH /api/courses/:id
//* @desc Update a course (instructor only)
//* @access Private
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized(endpoint.updateCourse),
  uploadCloud().single("thumbnail"),
  validation(CourseSchema.updateCourseValidation),
  courseService.updateCourse,
);

//* @route DELETE /api/courses/:id
//* @desc Delete a course (instructor only)
//* @access Private
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized(endpoint.deleteCourse),
  validation(CourseSchema.deleteCourseValidation),
  courseService.deleteCourse,
);

//* @route POST /api/courses/:id/publish
//* @desc Publish a course (instructor only)
//* @access Private

router.post(
  "/:id/publish",
  isAuthenticated,
  isAuthorized(endpoint.publishCourse),
  validation(CourseSchema.publishCourseValidation),
  courseService.publishCourse,
);

//* @route POST /api/courses/:id/archeive
//* @desc Archeive a course (instructor only)
//* @access Private
router.post(
  "/:id/archeive",
  isAuthenticated,
  isAuthorized(endpoint.archeiveCourse),
  validation(CourseSchema.archeiveCourseValidation),
  courseService.archiveCourse,
);

export default router;
