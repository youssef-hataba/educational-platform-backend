import mongoose, { Schema, Document } from "mongoose";

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  progress: number;
  completedLessons: mongoose.Types.ObjectId[];
  quizResults: { lesson: mongoose.Types.ObjectId; quiz: mongoose.Types.ObjectId; score: number; }[];
  enrolledAt: Date;
  certificateIssued:boolean;
}

const EnrollmentSchema: Schema = new Schema<IEnrollment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    quizResults: [
      {
        lesson: { type: mongoose.Types.ObjectId, ref: "Lesson", required: true },
        quiz: { type: mongoose.Types.ObjectId, ref: "Quiz", required: true },
        score: { type: Number, required: true },
        correctAnswers: { type: Number, required: true },
      },
    ],
    enrolledAt: { type: Date, default: Date.now },
    certificateIssued: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
export default Enrollment;
