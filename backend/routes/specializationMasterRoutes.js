import express from "express";
import { createSpecialization, deleteSpecialization, getSpecialization, getSpecializationById, updateSpecialization,  } from "../controllers/specializationMasterController.js";
import { authMiddleware, authorize } from "../middlewares/authorize.js";


const SpecializationMasterRouter = express.Router()

// @route   POST/api/specializationMaster/create
// @desc    create new Specialization
SpecializationMasterRouter.post("/create",authMiddleware,authorize("admin"), createSpecialization)


// @route   GET/api/specializationMaster/
// @desc   GET all Specialization
SpecializationMasterRouter.get("/",authMiddleware, getSpecialization)

// @route   GET/api/specializationMaster/:id
// @desc   GET single Specialization
SpecializationMasterRouter.get("/:id",authMiddleware, getSpecializationById)

// @route   PUT/api/specializationMaster/update/:id
// @desc   update Specialization
SpecializationMasterRouter.put("/update/:id",authMiddleware,authorize("admin"), updateSpecialization)

// @route   DELETE/api/specializationMaster/delete/:id
// @desc   delete Specialization
SpecializationMasterRouter.delete("/delete/:id",authMiddleware,authorize("admin"), deleteSpecialization)


export default SpecializationMasterRouter