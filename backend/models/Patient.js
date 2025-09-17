import mongoose, { model } from "mongoose";
const patientSchema=new mongoose.Schema(
    {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    patientDetails_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientDetails",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);
const patientModel=mongoose.model("Patient",patientSchema)
export default patientModel