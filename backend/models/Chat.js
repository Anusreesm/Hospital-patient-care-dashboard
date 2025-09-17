import mongoose,{ model } from "mongoose";
const chatScheema= new mongoose.Schema(
 { sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
const chatModel= mongoose.model("Chat",chatScheema)
export default chatModel