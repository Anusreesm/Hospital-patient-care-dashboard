import express from "express";


const HospitalStaffRouter = express.Router()

HospitalStaffRouter.get('/', getHospitalStaff)


export default HospitalStaffRouter