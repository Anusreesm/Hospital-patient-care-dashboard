import mongoose, { model } from "mongoose";
const addressSchema=new mongoose.Schema(
    {
   street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const addressModel= mongoose.model('Addresses',addressSchema)
export default addressModel