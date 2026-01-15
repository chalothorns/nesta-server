import mongoose from "mongoose";
import bcrypt from "bcrypt";


const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "admin" },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function(){
  if(!this.isModified("password")) return
  this.password = await bcrypt.hash(this.password, 10)
});

export const Admin = mongoose.model("Admin", adminSchema)