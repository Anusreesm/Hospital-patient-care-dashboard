import mongoose, { model } from "mongoose";

const bloodBankReqSchema=new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    blood_bank_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodBank",
      required: true
    },
    request_date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);
const bloodBankReqModel= mongoose.model('BloodBankReq',bloodBankReqSchema) 
export default bloodBankReqModel