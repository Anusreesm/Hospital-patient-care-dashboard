import express from "express";
import { addEmailLog, deleteEmailLog, getAllEmailLog, getEmailLogById, updateEmailLog } from "../controllers/EmailLogController.js";


const EmailLogRouter = express.Router()

// @route   POST/api/emailLog/create
// @desc    add EmailLog 
EmailLogRouter.post("/create", addEmailLog)


// @route   GET/api/emailLog/
// @desc   GET all EmailLog 
EmailLogRouter.get("/", getAllEmailLog)

// @route   GET/api/emailLog/:id
// @desc   GET single EmailLog  by id
EmailLogRouter.get("/:id", getEmailLogById)

// @route   PUT/api/emailLog/update/:id
// @desc   update EmailLog 
EmailLogRouter.put("/update/:id", updateEmailLog)

// @route   DELETE/api/emailLog/delete/:id
// @desc   delete EmailLog
EmailLogRouter.delete("/delete/:id", deleteEmailLog)





export default EmailLogRouter