import express from "express";


const StaffRouter = express.Router()

StaffRouter.get('/', getStaff)


export default StaffRouter