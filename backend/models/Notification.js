import mongoose,{ model } from "mongoose";
const notificationScheema= new mongoose.Schema(
    {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    read_status: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
const notificationModel= mongoose.model("Notification",notificationScheema)
export default notificationModel