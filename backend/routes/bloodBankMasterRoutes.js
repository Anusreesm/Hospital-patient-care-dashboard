import express from "express";
import { createBloodBank, deleteBloodBank, getBloodBank, getBloodBankById, updateBloodBank } from "../controllers/bloodBankMasterController.js";


const BloodBankMasterRouter = express.Router()

// @route   POST /api/bloodBank/create
// @desc    Create new blood bank 
BloodBankMasterRouter.post("/create", createBloodBank);

// @route   GET /api/bloodBank
// @desc    Get all blood bank 
BloodBankMasterRouter.get("/", getBloodBank);

// @route   GET /api/bloodBank/:id
// @desc    Get single blood bank 
BloodBankMasterRouter.get("/:id", getBloodBankById);

// @route   PUT /api/bloodBank/update/:id
// @desc    Update blood bank 
BloodBankMasterRouter.put("/update/:id", updateBloodBank);

// @route   DELETE /api/bloodBank/delete/:id
// @desc    Delete blood bank 
BloodBankMasterRouter.delete("/delete/:id", deleteBloodBank);


export default BloodBankMasterRouter