import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  sections: mongoose.Types.ObjectId[];
  price: number;
  category: string;
  language: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  duration: number;
  tags: string[];
  thumbnail: string;
  averageRating: number;
  totalReviews: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    price: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    language: [{ type: String, required: true, default: "English" }],
    requirements: [{ type: String }],
    whatYouWillLearn: [{ type: String }],
    duration: { type: Number },
    tags: [{ type: String }],
    thumbnail: { type: String, required: true },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CourseSchema.pre(/^find/, function (next) {
  if ((this as any)._skipIsPublishedCheck) return next();
  (this as mongoose.Query<any, any>).where({ isPublished: true });
  next();
});

const Course = mongoose.model<ICourse>("Course", CourseSchema);
export default Course;
