import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, maxLength: 500 },
    parentCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      default: null,
    },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});

categorySchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update.name) {
    update.slug = slugify(update.name, {
      lower: true,
      strict: true,
    });
  }
});
const Category = mongoose.model("Category", categorySchema);

export default Category;
