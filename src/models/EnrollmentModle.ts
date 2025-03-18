import mongoose, { Schema, Document } from "mongoose";

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  progress: number;
  completedLessons: mongoose.Types.ObjectId[];
  enrolledAt: Date;
  certificateIssued:boolean;
}

const EnrollmentSchema: Schema = new Schema<IEnrollment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    enrolledAt: { type: Date, default: Date.now },
    certificateIssued: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
export default Enrollment;
