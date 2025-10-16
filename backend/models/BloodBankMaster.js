import mongoose, { model } from "mongoose";

const bloodBankSchema=new mongoose.Schema(
   {
    blood_type: {
      type: String,
      enum: ["A+","A-","B+","B-","AB+","AB-","O+", "O-"],
      required: true,
      unique: true 
    },
    // ml
    available_unit: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);
const bloodBankModel= mongoose.model('BloodBank',bloodBankSchema) 
export default bloodBankModel