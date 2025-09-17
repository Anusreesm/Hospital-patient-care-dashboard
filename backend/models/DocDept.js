import mongoose, { model } from "mongoose";

const docDeptSchema= new mongoose.Schema(
   {
    dept_name: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);
const docDeptModel= mongoose.model("DocDept",docDeptSchema)
export default docDeptModel;