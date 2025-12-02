import express from "express";
import { createBloodBank, deleteBloodBank, getBloodBank, getBloodBankById, updateBloodBank } from "../controllers/bloodBankMasterController.js";
import { authMiddleware, authorize } from "../middlewares/authorize.js";


const BloodBankMasterRouter = express.Router()

// @route   POST /api/bloodBank/create
// @desc    Create new blood bank 
BloodBankMasterRouter.post("/create",authMiddleware, createBloodBank);

// @route   GET /api/bloodBank
// @desc    Get all blood bank 
BloodBankMasterRouter.get("/", authMiddleware,getBloodBank);

// @route   GET /api/bloodBank/:id
// @desc    Get single blood bank 
BloodBankMasterRouter.get("/:id",authMiddleware, getBloodBankById);

// @route   PUT /api/bloodBank/update/:id
// @desc    Update blood bank 
BloodBankMasterRouter.put("/update/:id",authMiddleware,authorize("admin"), updateBloodBank);

// @route   DELETE /api/bloodBank/delete/:id
// @desc    Delete blood bank 
BloodBankMasterRouter.delete("/delete/:id",authMiddleware,authorize("admin"), deleteBloodBank);


export default BloodBankMasterRouter