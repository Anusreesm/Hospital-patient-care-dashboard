import express from "express";
import { deletePatient, getPatient, getPatientById, registerPatient, updatePatient } from "../controllers/patientController.js";


const PatientRouter=express.Router()

// @route   POST/api/patient/register
// @desc    create new patient
PatientRouter.post("/register", registerPatient)


// @route   GET/api/patient/
// @desc   GET all patient
PatientRouter.get("/", getPatient)

// @route   GET/api/patient/:id
// @desc   GET single patient
PatientRouter.get("/:id", getPatientById)

// @route   PUT/api/patient/update/:id
// @desc   update patient
PatientRouter.put("/update/:id", updatePatient)

// @route   DELETE/api/patient/delete/:id
// @desc   delete staff
PatientRouter.delete("/delete/:id", deletePatient)


export default PatientRouter