import express from "express";
import { createSpecialization, deleteSpecialization, getSpecialization, getSpecializationById, updateSpecialization,  } from "../controllers/specializationMasterController.js";


const SpecializationMasterRouter = express.Router()

// @route   POST/api/specializationMaster/create
// @desc    create new Specialization
SpecializationMasterRouter.post("/create", createSpecialization)


// @route   GET/api/specializationMaster/
// @desc   GET all Specialization
SpecializationMasterRouter.get("/", getSpecialization)

// @route   GET/api/specializationMaster/:id
// @desc   GET single Specialization
SpecializationMasterRouter.get("/:id", getSpecializationById)

// @route   PUT/api/specializationMaster/update/:id
// @desc   update Specialization
SpecializationMasterRouter.put("/update/:id", updateSpecialization)

// @route   DELETE/api/specializationMaster/delete/:id
// @desc   delete Specialization
SpecializationMasterRouter.delete("/delete/:id", deleteSpecialization)


export default SpecializationMasterRouter