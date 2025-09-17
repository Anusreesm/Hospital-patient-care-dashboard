import express from "express";


const NotificationRouter = express.Router()

NotificationRouter.get('/', getNotification)


export default NotificationRouter