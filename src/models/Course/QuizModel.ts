import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface IQuiz extends Document {
  lesson: mongoose.Types.ObjectId;
  instructor: mongoose.Types.ObjectId;
  title: string;
  questions: IQuestion[];
  timeLimit?: number;
  passingScore: number;
  createdAt: Date;
}

const QuizSchema: Schema = new Schema<IQuiz>(
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String, required: true },
      },
    ],
    timeLimit: { type: Number, default: null },
    passingScore: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true }
);

QuizSchema.pre<IQuiz>("save", function (next) {
  if (!this.passingScore) {
    this.passingScore = Math.ceil(this.questions.length / 2);
  }
  next();
});

const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);
export default Quiz;
