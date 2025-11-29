import express from "express";
import { deletePatient, findPatientByPhone, getPatient, getPatientById, registerPatient, updatePatient } from "../controllers/patientController.js";
import { validateAddPatient, validateDeletePatient, validateGetPatientById, validateUpdatePatient } from "../validators/patientValidator.js";



const PatientRouter=express.Router()

// @route   POST/api/patient/register
// @desc    register new patient
PatientRouter.post("/register",validateAddPatient ,registerPatient)




// @route   GET/api/patient/
// @desc   GET all patient
PatientRouter.get("/", getPatient)

// @route   GET/api/patient/find-by-phone/:phone
// @desc   GET patient by phone number
PatientRouter.get("/find-by-phone/:phone",findPatientByPhone)

// @route   GET/api/patient/:id
// @desc   GET single patient
PatientRouter.get("/:id", validateGetPatientById,getPatientById)

// @route   PUT/api/patient/update/:id
// @desc   update patient
PatientRouter.put("/update/:id",validateUpdatePatient ,updatePatient)

// @route   DELETE/api/patient/delete/:id
// @desc   delete patient
PatientRouter.delete("/delete/:id", validateDeletePatient,deletePatient)


export default PatientRouter