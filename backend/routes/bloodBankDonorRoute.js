import express from "express";
import { createBloodBankDonor, deleteBloodBankDonor, getBloodBankDonor, getBloodBankDonorById, updateBloodBankDonor } from "../controllers/bloodBankDonorController.js";
const BloodBankDonorRouter = express.Router()
// @route   POST /api/bloodBankDonor/create
// @desc    Create new blood bank Req
BloodBankDonorRouter.post("/create", createBloodBankDonor);

// @route   GET /api/bloodBankDonor
// @desc    Get all blood bank Req
BloodBankDonorRouter.get("/", getBloodBankDonor);

// @route   GET /api/bloodBankDonor/:id
// @desc    Get single blood bank Req
BloodBankDonorRouter.get("/:id", getBloodBankDonorById);

// @route   PUT /api/bloodBankDonor/update/:id
// @desc    Update blood bank Req
BloodBankDonorRouter.put("/update/:id", updateBloodBankDonor);

// @route   DELETE /api/bloodBankDonor/delete/:id
// @desc    Delete blood bank Req
BloodBankDonorRouter.delete("/delete/:id", deleteBloodBankDonor);

export default BloodBankDonorRouter