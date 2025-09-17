import express from "express";


const FeedbackRouter = express.Router()

FeedbackRouter.get('/', getFeedback)


export default FeedbackRouter