import mongoose from "mongoose";

const bloodBankSchema = new mongoose.Schema(
  {
    blood_type: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      unique: true, // One entry per blood type
    },
    available_unit: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // cannot go negative
    },
    last_updated: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

const bloodBankModel = mongoose.model("BloodBank", bloodBankSchema);
export default bloodBankModel;
