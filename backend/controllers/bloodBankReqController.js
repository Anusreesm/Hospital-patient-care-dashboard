import mongoose from "mongoose";
import { errorResponse, successResponse } from "../constants/response.js";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import bloodBankReqModel from "../models/BloodBankRequest.js";
import { getBloodReqByIdQuery, getBloodReqQuery } from "../services/bloodBankReqService.js";

// @route   POST /api/bloodBankReq/create
// @desc    Create new blood bank Req
// @access staff/admin
export const createBloodBankReq = async (req, res) => {
    try {
        const { user_id, blood_bank_id, status, priority } = req.body

        const request_date = new Date();
        // // Check duplicate entry
        // const existing = await bloodBankReqModel.findOne({
        //     user_id,
        //     blood_bank_id,
        //     request_date: {
        //         $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        //         $lt: new Date(new Date().setHours(23, 59, 59, 999))
        //     }
        // });
        // if (existing) {
        //     return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_EXISTS);
        // }


        // to create bloodbankReq (no fulfilled_date / reason here)
        const bloodBankReq = await bloodBankReqModel.create({
            user_id,
            blood_bank_id,
            request_date,
            status,
            priority
        });
        return successResponse(
            res,
            STATUS.OK,
            {
                _id: bloodBankReq._id,
                user_id: bloodBankReq.user_id,
                blood_bank_id: bloodBankReq.blood_bank_id,
                request_date: bloodBankReq.request_date,
                status: bloodBankReq.status,
                priority: bloodBankReq.priority

            },
            MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_CREATED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET /api/bloodBankReq
// @desc    Get all blood bank Req
// @access staff/admin
export const getBloodBankReq = async (req, res) => {
    try {
        const bloodBankReq = await getBloodReqQuery()
        return successResponse(
            res,
            STATUS.OK,
            {
                bloodBankReq
            },
            MESSAGES.BLOODBANK_REQ.BLOODBANK_REQS_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET /api/bloodBankReq/:id
// @desc    Get single blood bank Req
// @access staff/admin
export const getBloodBankReqById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK_REQ.INVALID_BLOODBANK_REQ_ID);
        }
        // to get single bloodBankReq  by id
        const blood_BankReq = await getBloodReqByIdQuery(id)
        if (!blood_BankReq) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { blood_BankReq },
            MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   PUT /api/bloodBankReq/update/:id
// @desc    Update blood bank Req
// @access staff/admin
export const updateBloodBankReq = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority, reason } = req.body;
        // Check if the request exists
        const existingReq = await bloodBankReqModel.findById(id);
        if (!existingReq) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_NOT_FOUND);
        }
        // Prepare update fields
        const updateData = {};
        if (status) {
            updateData.status = status;
            // Auto set fulfilled_date only when status is approved or rejected
            if (status === "approved" || status === "rejected") {
                updateData.fulfilled_date = Date.now();
            } else {
                updateData.fulfilled_date = null;
            }
        }

        if (priority) updateData.priority = priority;
        if (reason) updateData.reason = reason;
        // Update and return the new document
        const updatedReq = await bloodBankReqModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return successResponse(
            res,
            STATUS.OK,
            updatedReq,
            MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_UPDATED
        );
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   DELETE /api/bloodBankReq/delete/:id
// @desc    Delete blood bank Req
// @access staff/admin
export const deleteBloodBankReq = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK_REQ.INVALID_BLOODBANK_REQ_ID);
        }
        // to delete
        const bloodBankReq = await bloodBankReqModel.findByIdAndDelete(id)
        if (!bloodBankReq) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { bloodBankReq },
            MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_DELETED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}