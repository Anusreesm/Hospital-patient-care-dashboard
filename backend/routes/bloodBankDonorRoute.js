import express from "express";
import { createBloodBankDonor, deleteBloodBankDonor, getBloodBankDonor, getBloodBankDonorById, updateBloodBankDonor } from "../controllers/bloodBankDonorController.js";
import { authMiddleware, authorize } from "../middlewares/authorize.js";
const BloodBankDonorRouter = express.Router()
// @route   POST /api/bloodBankDonor/create
// @desc    Create new blood bank Donor
BloodBankDonorRouter.post("/create",authMiddleware,authorize("admin","staff","doctor"), createBloodBankDonor);

// @route   GET /api/bloodBankDonor
// @desc    Get all blood bank Donor
BloodBankDonorRouter.get("/",authMiddleware,authorize("admin","staff","doctor"), getBloodBankDonor);

// @route   GET /api/bloodBankDonor/:id
// @desc    Get single blood bank Donor
BloodBankDonorRouter.get("/:id",authMiddleware,authorize("admin","staff","doctor"), getBloodBankDonorById);

// @route   PUT /api/bloodBankDonor/update/:id
// @desc    Update blood bank Donor
BloodBankDonorRouter.put("/update/:id",authMiddleware,authorize("admin","staff","doctor"), updateBloodBankDonor);

// @route   DELETE /api/bloodBankDonor/delete/:id
// @desc    Delete blood bank Donor
BloodBankDonorRouter.delete("/delete/:id",authMiddleware,authorize("admin","staff","doctor"), deleteBloodBankDonor);

export default BloodBankDonorRouter