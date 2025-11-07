import express from "express";
import { createNotification, deleteNotification, getAllNotification, getNotificationById, updateNotification } from "../controllers/NotificationController.js";


const NotificationRouter = express.Router()

// @route   POST /api/notification/create
// @desc    Create new feedback
NotificationRouter.post("/create", createNotification);

// @route   GET /api/notification/
// @desc    Get all Notifications
NotificationRouter.get("/", getAllNotification);

// @route   GET /api/notification/:id
// @desc    Get a single Notification by ID
NotificationRouter.get("/:id", getNotificationById);

// @route   PUT /api/notification/update/:id
// @desc    Update Notification by ID
NotificationRouter.put("/update/:id", updateNotification);

// @route   DELETE /api/notification/delete/:id
// @desc    Delete Notification by ID
NotificationRouter.delete("/delete/:id", deleteNotification);



export default NotificationRouter