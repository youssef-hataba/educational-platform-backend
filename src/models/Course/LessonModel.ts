import mongoose, { Schema, Document, mongo } from "mongoose";

// Lesson Schema
export interface ILesson extends Document {
  title: string;
  videoUrl: string;
  duration: number; // in minutes
  attachments?: string[];
  quiz?: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  section: mongoose.Types.ObjectId;
  instructor: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema = new Schema<ILesson>(
  {
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    attachments: [{ type: String }],
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Attachment" },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model<ILesson>("Lesson", LessonSchema);
export default Lesson;