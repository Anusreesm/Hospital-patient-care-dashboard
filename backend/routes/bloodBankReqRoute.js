import express from "express";
import { createBloodBankReq, deleteBloodBankReq, getBloodBankReq, getBloodBankReqById, getConfirmedAppointments, updateBloodBankReq } from "../controllers/bloodBankReqController.js";
import { authMiddleware, authorize } from "../middlewares/authorize.js";


const BloodBankReqRouter = express.Router()


// @route   PUT /api/bloodBankReq/confirmed-appointments
// @desc    load confirmed appointments for dropdown
BloodBankReqRouter.get("/confirmed-appointments", authMiddleware,authorize("admin","staff","doctor"),getConfirmedAppointments);


// @route   POST /api/bloodBankReq/create
// @desc    Create new blood bank Req
BloodBankReqRouter.post("/create",authMiddleware,authorize("admin","staff","doctor"), createBloodBankReq);

// @route   GET /api/bloodBankReq
// @desc    Get all blood bank Req
BloodBankReqRouter.get("/",authMiddleware,authorize("admin","staff","doctor"), getBloodBankReq);

// @route   GET /api/bloodBankReq/:id
// @desc    Get single blood bank Req
BloodBankReqRouter.get("/:id",authMiddleware,authorize("admin","staff","doctor"), getBloodBankReqById);

// @route   PUT /api/bloodBankReq/update/:id
// @desc    Update blood bank Req
BloodBankReqRouter.put("/update/:id",authMiddleware,authorize("admin","staff","doctor"), updateBloodBankReq);



// @route   DELETE /api/bloodBankReq/delete/:id
// @desc    Delete blood bank Req
BloodBankReqRouter.delete("/delete/:id",authMiddleware,authorize("admin","staff","doctor"), deleteBloodBankReq);



export default BloodBankReqRouter