import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  course: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema<IReview>(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent a user from submitting multiple reviews for the same course
ReviewSchema.index({ course: 1, user: 1 }, { unique: true });

const Review = mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
