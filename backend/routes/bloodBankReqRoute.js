import express from "express";
import { createBloodBankReq, deleteBloodBankReq, getBloodBankReq, getBloodBankReqById, updateBloodBankReq } from "../controllers/bloodBankReqController.js";


const BloodBankReqRouter = express.Router()
// @route   POST /api/bloodBankReq/create
// @desc    Create new blood bank Req
BloodBankReqRouter.post("/create", createBloodBankReq);

// @route   GET /api/bloodBankReq
// @desc    Get all blood bank Req
BloodBankReqRouter.get("/", getBloodBankReq);

// @route   GET /api/bloodBankReq/:id
// @desc    Get single blood bank Req
BloodBankReqRouter.get("/:id", getBloodBankReqById);

// @route   PUT /api/bloodBankReq/update/:id
// @desc    Update blood bank Req
BloodBankReqRouter.put("/update/:id", updateBloodBankReq);

// @route   DELETE /api/bloodBankReq/delete/:id
// @desc    Delete blood bank Req
BloodBankReqRouter.delete("/delete/:id", deleteBloodBankReq);



export default BloodBankReqRouter