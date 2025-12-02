import express from "express";
import { deletePatient, findPatientByPhone, getPatient, getPatientById, registerPatient, updatePatient } from "../controllers/patientController.js";
import { validateAddPatient, validateDeletePatient, validateGetPatientById, validateUpdatePatient } from "../validators/patientValidator.js";
import { authMiddleware, authorize } from "../middlewares/authorize.js";



const PatientRouter=express.Router()

// @route   POST/api/patient/register
// @desc    register new patient
PatientRouter.post("/register",authMiddleware,authorize("admin","staff","doctor"),validateAddPatient ,registerPatient)

// @route   GET/api/patient/
// @desc   GET all patient
PatientRouter.get("/",authMiddleware, getPatient)

// @route   GET/api/patient/find-by-phone/:phone
// @desc   GET patient by phone number
PatientRouter.get("/find-by-phone/:phone",authMiddleware,authorize("admin","staff","doctor"),findPatientByPhone)

// @route   GET/api/patient/:id
// @desc   GET single patient
PatientRouter.get("/:id",authMiddleware, validateGetPatientById,getPatientById)

// @route   PUT/api/patient/update/:id
// @desc   update patient
PatientRouter.put("/update/:id",authMiddleware,validateUpdatePatient ,updatePatient)

// @route   DELETE/api/patient/delete/:id
// @desc   delete patient
PatientRouter.delete("/delete/:id",authMiddleware,authorize("admin","staff","doctor"), validateDeletePatient,deletePatient)


export default PatientRouter