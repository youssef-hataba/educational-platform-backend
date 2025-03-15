import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

export enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "admin",
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  enrolledCourses: Types.ObjectId[];
  fullName: string;
  isActive:boolean;
  deactivatedAt: Date;
  comparePassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
    enrolledCourses: [{ type: Types.ObjectId, ref: "Course" }],
    isActive: { type: Boolean, default: true },
    deactivatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});


userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


userSchema.methods.comparePassword = async function (candidatePassword: string, userPassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
