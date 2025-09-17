import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    phone: {type: Number, required: false },
    password: { type: String, required: true },
    isBlocked: { type: Number,default: 0},
    isAdmin: {type: Number,required: true,default:0},
    image: { type: String } 
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
