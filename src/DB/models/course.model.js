import mongoose from "mongoose";
import slugify from "slugify";
import { defulatPublic_Id, defulatSecure_Url } from "./user.model.js";

export const courseLevels = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  ALL: "all",
};

export const courseStatuses = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },

    slug: { type: String, unique: true, lowercase: true },

    description: { type: String, required: true, maxlength: 5000 },
    shortDescription: { type: String, maxlength: 300 },

    instructor: { type: mongoose.Schema.ObjectId, ref: "User", required: true },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: { type: mongoose.Schema.ObjectId, ref: "Category" },

    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    currency: { type: String, default: "USD" },

    thumbnail: {
      secure_url: { type: String, default: defulatSecure_Url },
      public_id: { type: String, default: defulatPublic_Id },
    },
    previewVideo: { type: String },

    level: {
      type: String,
      enum: Object.values(courseLevels),
    },

    language: { type: String, default: "English" },
    tags: [{ type: String }],
    requirements: [{ type: String }],
    objectives: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(courseStatuses),
      default: courseStatuses.DRAFT,
    },

    publishedAt: { type: Date },
    totalDuration: { type: Number, default: 0 }, // minutes
    totalLessons: { type: Number, default: 0 },
    totalEnrolled: { type: Number, default: 0 },
    rating: { average: Number, count: Number },
    isFree: { type: Boolean, default: false },
    certificate: { type: Boolean, default: true },
  },
  { timestamps: true },
);

courseSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

courseSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update.title) {
    update.slug = slugify(update.title, {
      lower: true,
      strict: true,
    });
  }
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
