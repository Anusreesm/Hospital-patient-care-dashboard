import mongoose,{ model } from "mongoose";
const feedbackScheema= new mongoose.Schema(
    {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);
const feedbackModel= mongoose.model("Feedback",feedbackScheema)
export default feedbackModel