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
       match: [/^\d{10}$/, 'Phone number must be 10 digits']
    },

    medical_license: {
      type: String,
    },
    exp_years: {
      type: Number,
      required: true,
      min: 0, max: 100

    },
    specialization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization"
    },
    //  NEW FIELDS
    isActive: {
      type: Boolean,
      default: true,
      index: true, 
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true
  }
);
const hospitalStaffModel = mongoose.model("HospitalStaff", hospitalStaffSchema)
export default hospitalStaffModel;