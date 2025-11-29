
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null
    },
    reg_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
     
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     
    },
    hosp_staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalStaff",
      required: true
    },
    specialization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization",
      required: true
    },
    date: {
      type: Date,
      required: true,
      get: (val) => {
        if (!val) return val;
        const d = new Date(val);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      }
    },
    time: {
      type: String, // store as 'HH:mm'
      required: true,
      match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // 24-hour format validation
    },
    description: {
      type: String,
      trim: true
    },
    token_no: {
      type: String,
      required: true,
      unique:true
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed","cancelled","missed"],
      default: "scheduled" 
    },
    amount:{
       type: Number,
  required: false,
  default: 0
    }
  },
  { timestamps: true }
);
const appointmentModel = mongoose.model('Appointment', appointmentSchema)
export default appointmentModel