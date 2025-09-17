import mongoose,{ model } from "mongoose";
const emailLogScheema= new mongoose.Schema(
    {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    date_sent: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
const emailLogModel= mongoose.model("EmailLog",emailLogScheema)
export default emailLogModel