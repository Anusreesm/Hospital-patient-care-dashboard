import mongoose, { model } from "mongoose";

const staffSchema= new mongoose.Schema(
    {
    staff_name: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);
const staffModel= mongoose.model("Staff",staffSchema)
export default staffModel;