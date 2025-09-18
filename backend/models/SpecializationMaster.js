import mongoose, { model } from "mongoose";

const specializationSchema= new mongoose.Schema(
   {
    specialization: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);
const specializationModel= mongoose.model("Specialization",specializationSchema)
export default specializationModel;