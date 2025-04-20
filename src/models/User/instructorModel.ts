import mongoose from "mongoose";
import User from "./UserModel";

interface SocialLinks {
  website?: string;
  x?: string;
  linkedin?: string;
  youtube?: string;
}

interface IInstructor {
  title: string;
  bio: string;
  socialLinks: SocialLinks;
  totalStudents: number;
  courses: mongoose.Types.ObjectId[];
  reviews: number;
}


const instructorSchema = new mongoose.Schema<IInstructor>(
  {
    title: { type: String, required: true },
    bio: { type: String, required: true },
    socialLinks: {
      website: { type: String, default: "" },
      x: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    totalStudents: { type: Number, default: 0 },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    reviews: { type: Number, default: 0 },
  },
  {
    collection: "instructors",
    timestamps: true,
  }
);

export const Instructor = User.discriminator("instructor", instructorSchema);