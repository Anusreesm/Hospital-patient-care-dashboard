import express from "express";
import { addChat, deleteChat, getAllChat, getChatById, updateChat } from "../controllers/ChatController.js";


const ChatRouter = express.Router()
// @route   POST/api/chat/create
// @desc    add Chat 
ChatRouter.post("/create", addChat)


// @route   GET/api/chat/
// @desc   GET all Chat 
ChatRouter.get("/", getAllChat)

// @route   GET/api/chat/:id
// @desc   GET single chat  by id
ChatRouter.get("/:id", getChatById)

// @route   PUT/api/chat/update/:id
// @desc   update Chat 
ChatRouter.put("/update/:id", updateChat)

// @route   DELETE/api/chat/delete/:id
// @desc   delete Chat
ChatRouter.delete("/delete/:id", deleteChat)





export default ChatRouter