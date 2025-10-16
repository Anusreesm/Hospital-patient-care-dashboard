import express from "express";
import { addPatientAddress, deletePatientAddress, getPatientAddress, getPatientAddressById, updatePatientAddress } from "../controllers/patientAddressController.js";

const PatientAddressRouter=express.Router()

// @route   POST/api/patientAddress/create
// @desc    add Patient Address
PatientAddressRouter.post("/create", addPatientAddress)


// @route   GET/api/patientAddress/
// @desc   GET all patient Address
PatientAddressRouter.get("/", getPatientAddress)

// @route   GET/api/patientAddress/:id
// @desc   GET single  Address by id
PatientAddressRouter.get("/:id", getPatientAddressById)

// @route   PUT/api/patientAddress/update/:id
// @desc   update patient Address
PatientAddressRouter.put("/update/:id", updatePatientAddress)

// @route   DELETE/api/patientAddress/delete/:id
// @desc   delete address
PatientAddressRouter.delete("/delete/:id", deletePatientAddress)


export default PatientAddressRouter