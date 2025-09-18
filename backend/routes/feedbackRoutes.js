import express from "express";
import { createFeedback, deleteFeedback, getAllFeedback, getFeedbackById, updateFeedback } from "../controllers/feedBackController.js";


const FeedbackRouter = express.Router()

// @route   POST /api/feedback/create
// @desc    Create new feedback
FeedbackRouter.post("/create", createFeedback);

// @route   GET /api/feedback/
// @desc    Get all feedbacks
FeedbackRouter.get("/", getAllFeedback);

// @route   GET /api/feedback/:id
// @desc    Get a single feedback by ID
FeedbackRouter.get("/:id", getFeedbackById);

// @route   PUT /api/feedback/update/:id
// @desc    Update feedback by ID
FeedbackRouter.put("/update/:id", updateFeedback);

// @route   DELETE /api/feedback/delete/:id
// @desc    Delete feedback by ID
FeedbackRouter.delete("/delete/:id", deleteFeedback);


export default FeedbackRouter