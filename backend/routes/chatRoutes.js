import express from "express";


const ChatRouter = express.Router()

ChatRouter.get('/', getChat)


export default ChatRouter