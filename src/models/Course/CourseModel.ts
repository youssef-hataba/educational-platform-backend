import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  sections: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
  price: number;
  category: string;
  language: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  duration: number;
  tags: string[];
  thumbnail: string;
  rating: number;
  totalRatings: number;
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
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    language: [{ type: String, required: true, default: "English" }],
    requirements: [{ type: String }],
    whatYouWillLearn: [{ type: String }],
    duration: { type: Number, required: true },
    tags: [{ type: String }],
    thumbnail: { type: String, required: true },
    rating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("Course", CourseSchema);
export default Course;
