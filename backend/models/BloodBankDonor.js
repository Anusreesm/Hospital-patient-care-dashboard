import mongoose, { model } from "mongoose";

const bloodBankDonorSchema = new mongoose.Schema(
  {
    donor_name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true
    },

   blood_type: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    //bags
    available_unit: {
      type: Number,
      required: true
    },

    date: {
      type: Date,
      required: true
    },
   status: {
      type: String,
      enum: ['SCHEDULED', 'COMPLETED'], 
      default: 'SCHEDULED',
      required: true,
    },
  },
  { timestamps: true }
);
const bloodBankDonorModel = mongoose.model('BloodBankDonor', bloodBankDonorSchema)
export default bloodBankDonorModel