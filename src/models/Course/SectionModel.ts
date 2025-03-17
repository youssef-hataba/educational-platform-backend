import mongoose, { Schema, Document } from "mongoose";

export interface ISection extends Document {
  title: string;
  description?: string;
  course: mongoose.Types.ObjectId;
  lessons: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema: Schema = new Schema<ISection>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  },
  { timestamps: true }
);

const Section = mongoose.model<ISection>("Section", SectionSchema);

export default Section;