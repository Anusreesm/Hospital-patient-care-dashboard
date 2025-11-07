import mongoose, { model } from "mongoose";

const regSchema= new mongoose.Schema(
   {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    registration_date: {
      type: Date,
      default: Date.now,
      required:true
    },
    discharge_date: {
      type: Date
    },
    medical_condition: {
      type: String,
      required: true
    },
    allergies: {
      type: String
    },
    status: {
      type: String,
      enum: ["active", "discharged","deleted"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);
const regModel= mongoose.model('Registration', regSchema)
export default regModel