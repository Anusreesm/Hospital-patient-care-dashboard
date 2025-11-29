import mongoose, { model } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
     required:false
    },
    hosp_staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalStaff",
      required: false
    },
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
       required: false, 
    },
    amount: {
      type: Number,
      required: true
    },
    payment_method: {
      type: String,
      enum: ["cash", "card", "upi", "netbanking"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed","deleted"],
      default: "pending"
    },
    description: {
      type: String,
      trim: true
    },
     transactionId: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);
const paymentModel = mongoose.model('Payment', paymentSchema)
export default paymentModel