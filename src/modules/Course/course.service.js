import asyncHandler from "express-async-handler";
import Course, { courseStatuses } from "../../DB/models/course.model.js";
import User, { userRoles } from "../../DB/models/user.model.js";
import Category from "../../DB/models/category.model.js";
import cloudinary from "../../utils/upload/cloudinary.config.js";

//* @desc Create a new course for instructor

export const createCourse = asyncHandler(async (req, res, next) => {
  const { category, price, discountPrice } = req.body;

  if (!req.file) {
    return next(new Error("Thumbnail is required!", { cause: 400 }));
  }

  const categoryExists = await Category.findById(category);

  if (!categoryExists) {
    return next(new Error("Category not found!", { cause: 404 }));
  }

  const priceNum = Number(price);
  const discountNum = discountPrice ? Number(discountPrice) : null;

  if (discountNum !== null && discountNum >= priceNum) {
    return next(
      new Error("Discount price must be less than price", {
        cause: 400,
      }),
    );
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/courses/${req.body.title}/thumbnail`,
    },
  );

  const course = await Course.create({
    ...req.body,
    instructor: req.user._id,
    price: priceNum,
    discountPrice: discountNum,
    thumbnail: { secure_url, public_id },
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

//* @desc Get all courses with pagination and filtering
export const getCourses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const courses = await Course.find({ status: courseStatuses.PUBLISHED })
    .skip(skip)
    .limit(limit)
    .populate({ path: "instructor", select: "firstName email profilePicture" });

  return res.status(200).json({
    success: true,
    message: "Courses retrieved successfully",
    count: courses.length,
    data: courses,
  });
});

//* @desc Get a single course by slug
export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug })
    .populate({
      path: "instructor",
      select: "firstName email profilePicture",
    })
    .populate({ path: "category", select: "name" });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Course retrieved successfully",
    data: course,
  });
});

//* @desc Update a course (instructor only)
export const updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new Error("Course not found", { cause: 404 }));
  }

  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== userRoles.ADMIN
  ) {
    return next(new Error("Unauthorized", { cause: 403 }));
  }

  const price = req.body.price ?? course.price;
  const discountPrice = req.body.discountPrice;

  if (discountPrice !== undefined && discountPrice >= price) {
    return next(
      new Error("Discount price must be less than price", { cause: 400 }),
    );
  }

  let thumbnailData = course.thumbnail;

  if (req.file) {
    if (course.thumbnail?.public_id) {
      await cloudinary.uploader.destroy(course.thumbnail.public_id);
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: `${process.env.CLOUD_FOLDER_NAME}/courses/${course.title}/thumbnail`,
    });

    thumbnailData = {
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      thumbnail: thumbnailData,
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    success: true,
    data: updatedCourse,
  });
});
//* @desc Delete a course (instructor only)
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new Error("Course not found!", { cause: 404 }));
  }

  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== userRoles.ADMIN
  ) {
    return next(
      new Error("Unauthorized to delete this course!", { cause: 403 }),
    );
  }

  await Course.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});

//* @desc publish a course (instructor only)
export const publishCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new Error("Course not found!", { cause: 404 }));
  }

  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== userRoles.ADMIN
  ) {
    return next(
      new Error("Unauthorized to publish this course!", { cause: 403 }),
    );
  }

  if (
    !course.title &&
    !course.description &&
    !course.price &&
    !course.thumbnail
  ) {
    return next(
      new Error(
        "Course must have title, description, price and thumbnail to be published!",
        { cause: 400 },
      ),
    );
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { status: courseStatuses.PUBLISHED, publishedAt: new Date() },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: "Course published successfully",
    data: updatedCourse,
  });
});

//* @desc archive a course (instructor only)
export const archiveCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new Error("Course not found!", { cause: 404 }));
  }

  if (
    course.instructor.toString() !== req.user._id.toString() &&
    req.user.role !== userRoles.ADMIN
  ) {
    return next(
      new Error("Unauthorized to archive this course!", { cause: 403 }),
    );
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { status: courseStatuses.ARCHIVED },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: "Course archived successfully",
    data: updatedCourse,
  });
});

//* @desc Get courses of the logged in instructor
export const MyCourses = asyncHandler(async (req, res, next) => {
  console.log(req.user._id);

  const courses = await Course.find({ instructor: req.user._id })
    .populate({
      path: "instructor",
      select: "firstName email profilePicture",
    })
    .populate({ path: "category", select: "name" });

  if (!courses) {
    return next(
      new Error("No courses found for this instructor!", { cause: 404 }),
    );
  }

  return res.status(200).json({
    success: true,
    message: "My courses retrieved successfully",
    count: courses.length,
    data: courses,
  });
});
