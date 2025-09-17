import mongoose, { model } from "mongoose";

const hospitalStaffSchema= new mongoose.Schema(
   {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: Number,
      required: true,
      trim: true
    },
    medical_license: {
      type: String,
      required: true
    },
    exp_years: {
      type: Number,
      required: true
    },
    doc_dept_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocDept",
      required: true
    },
    specialization: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const hospitalStaffModel= mongoose.model("HospitalStaff",hospitalStaffSchema)
export default hospitalStaffModel;