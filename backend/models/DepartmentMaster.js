import mongoose, { model } from "mongoose";

const deptSchema= new mongoose.Schema(
    {
    dept_name: {
      type: String,
      required: true,
      trim: true,
    },
     isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true
  }
);
const deptModel= mongoose.model("Department",deptSchema)
export default deptModel;