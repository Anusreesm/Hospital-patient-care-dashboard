import mongoose, { model } from "mongoose";

const hospitalStaffSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dept_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    medical_license: {
      type: String,
    },
    exp_years: {
      type: Number,
      required: true,

    },
    specialization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization"
    },

  },
  {
    timestamps: true
  }
);
const hospitalStaffModel = mongoose.model("HospitalStaff", hospitalStaffSchema)
export default hospitalStaffModel;