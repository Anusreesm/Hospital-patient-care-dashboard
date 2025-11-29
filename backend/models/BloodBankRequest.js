import mongoose, { model } from "mongoose";

const bloodBankReqSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true
    },
 
    request_date: {
      type: Date,
      required: true
    },
    units_required: {
      type: Number
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "rejected", "approved"],
      default: "pending"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "emergency"],
      default: "medium"
    },
    fulfilled_date: {
      type: Date
    },
     wasStockDeducted: {
        type: Boolean,
        default: false
    },
    reason: {
      type: String
    }
  },
  { timestamps: true }
);
const bloodBankReqModel = mongoose.model('BloodBankReq', bloodBankReqSchema)
export default bloodBankReqModel