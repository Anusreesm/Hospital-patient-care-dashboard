import express from "express";
import { deletehospStaff, gethospStaff, gethospStaffById, registerhospStaff, updatehospStaff } from "../controllers/hospitalStaffController.js";
import { ValidateAddHospStaff } from "../validators/hospStaffValidators.js";
import { authMiddleware, authorize } from "../middlewares/authorize.js";


const HospitalStaffRouter = express.Router()

// @route   POST/api/hospStaff/register
// @desc    create new staff
HospitalStaffRouter.post("/register",authMiddleware,authorize("admin"),ValidateAddHospStaff, registerhospStaff)


// @route   GET/api/hospStaff/
// @desc   GET all staff
HospitalStaffRouter.get("/",authMiddleware, gethospStaff)

// @route   GET/api/hospStaff/:id
// @desc   GET single staff
HospitalStaffRouter.get("/:id",authMiddleware, gethospStaffById)

// @route   PUT/api/hospStaff/update/:id
// @desc   update staff
HospitalStaffRouter.put("/update/:id",authMiddleware, updatehospStaff)

// @route   DELETE/api/hospStaff/delete/:id
// @desc   delete staff
HospitalStaffRouter.delete("/delete/:id",authMiddleware,authorize("admin"), deletehospStaff)


export default HospitalStaffRouter