import express from "express";


const EmailLogRouter = express.Router()

EmailLogRouter.get('/', getEmailLog)


export default EmailLogRouter