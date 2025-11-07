import express from "express";
import { createReg, deleteReg, getAllReg, getRegById, updateReg } from "../controllers/registrationController.js";
import { validateAddReg, validateDeleteReg, validateRegById, validateUpdateReg } from "../validators/regValidator.js";


const RegistrationRouter = express.Router()

// @route   POST /api/registration/create
// @desc    Create new registration
RegistrationRouter.post("/create",validateAddReg, createReg);

// @route   GET /api/registration/
// @desc    Get all registrations
RegistrationRouter.get("/", getAllReg);

// @route   GET /api/registration/:id
// @desc    Get a single registration by ID
RegistrationRouter.get("/:id",validateRegById, getRegById);

// @route   PUT /api/registration/update/:id
// @desc    Update registration by ID
RegistrationRouter.put("/update/:id",validateUpdateReg, updateReg);

// @route   DELETE /api/registration/delete/:id
// @desc    Delete registration by ID
RegistrationRouter.delete("/delete/:id",validateDeleteReg, deleteReg);



export default RegistrationRouter