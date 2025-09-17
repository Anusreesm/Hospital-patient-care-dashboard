import mongoose, { model } from "mongoose";

const appointmentSchema=new mongoose.Schema(
   {
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true
    },
    reg_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hosp_staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalStaff",
      required: true
    },
    doc_dept_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocDept",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    token_no: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
const appointmentModel= mongoose.model('Appointment',appointmentSchema) 
export default appointmentModel