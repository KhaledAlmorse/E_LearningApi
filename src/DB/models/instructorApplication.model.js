import mongoose from "mongoose";

export const applicationStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const instructorApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
      unique: true,
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      maxLength: [1000, "Bio must be less than 1000 characters"],
    },
    expertise: {
      type: String,
      required: [true, "Expertise is required"],
    },
    linkedInUrl: {
      type: String,
      match: /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
      required: [true, "LinkedIn URL is required"],
    },
    status: {
      type: String,
      enum: Object.values(applicationStatus),
      default: applicationStatus.PENDING,
    },
    reviewedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },

    rejectedReason: {
      type: String,
      maxLength: [500, "Rejection reason must be less than 500 characters"],
    },
  },
  { timestamps: true },
);

const InstructorApplication = mongoose.model(
  "InstructorApplication",
  instructorApplicationSchema,
);

export default InstructorApplication;
