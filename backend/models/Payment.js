import mongoose, { model } from "mongoose";

const paymentSchema=new mongoose.Schema(
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
    hosp_staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalStaff", 
      required: true
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
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);
const paymentModel= mongoose.model('Payment',paymentSchema) 
export default paymentModel