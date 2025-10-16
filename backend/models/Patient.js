import mongoose, { model } from "mongoose";
const patientSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    created_by: {
      // The admin/staff who added the patient
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    addresses_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Addresses",
      required: true
    },
    phone: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      required: true
    },
   
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true
    },
    bloodBank_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBank",
      required: true
    },
    emergency_name: {
      type: String,

    },
    emergency_contact: {
      type: String,

    }
  },
  {
    timestamps: true
  }
);
const patientModel = mongoose.model("Patient", patientSchema)
export default patientModel