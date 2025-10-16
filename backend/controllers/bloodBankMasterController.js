
import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js";
import bloodBankModel from "../models/BloodBankMaster.js";


// @route   POST /api/bloodBank/create
// @desc    Create new blood bank 
// @access Admin/staff 
export const createBloodBank = async (req, res) => {
    try {
        const { blood_type, available_unit } = req.body
        // Check duplicate entry
        const existing = await bloodBankModel.findOne({ blood_type });
        if (existing) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.BLOODTYPE_EXISTS);
        }
        // Validate available units
        if (available_unit <= 0) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.AVAIL_UNITS_NOT_ZERO_NEGATIVE);
        }
        // to create bloodbank
        const bloodBank = await bloodBankModel.create({
            blood_type,
            available_unit
        });
        return successResponse(
            res,
            STATUS.OK,
            {
                _id: bloodBank._id,
                blood_type: bloodBank.blood_type,
                available_unit: bloodBank.available_unit
            },
            MESSAGES.BLOODBANK.BLOODBANK_CREATED
        )
    }
    catch (error) {
        console.error("create BLOOD BANK Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET /api/bloodBank
// @desc    Get all blood bank 
// @access Admin/staff 
export const getBloodBank = async (req, res) => {
    try {
        // To find All Bloodbanks
        const bloodBank = await bloodBankModel.find()
        return successResponse(
            res,
            STATUS.OK,
            {
                bloodBank
            },
            MESSAGES.BLOODBANK.BLOODBANKS_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET /api/bloodBank/:id
// @desc    Get single blood bank 
// @access Admin/staff 
export const getBloodBankById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.INVALID_BLOODBANK_ID);
        }
        // to get single bloodBank  by id
        const blood_Bank = await bloodBankModel.findById(id)
        if (!blood_Bank) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANK.BLOODBANK_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { blood_Bank },
            MESSAGES.BLOODBANK.BLOODBANK_FETCHED
        )
    }
    catch (error) {

        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   PUT /api/bloodBank/update/:id
// @desc    Update blood bank 
// @access Admin/staff 
export const updateBloodBank = async (req, res) => {
    try {
        const { id } = req.params
        const { blood_type, available_unit } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.INVALID_BLOODBANK_ID);
        }
        // Validate available units
        if (available_unit <= 0) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.AVAIL_UNITS_NOT_ZERO_NEGATIVE);
        }
        // Check if blood_type is provided
        if (!blood_type || !blood_type.trim()) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.BLOODBANK_TYPE_REQUIRED);
        }

        // Check if Bloodbank exists
        const bloodBank = await bloodBankModel.findById(id);
        if (!bloodBank) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANK.BLOODBANK_NOT_FOUND);
        }

        const normalizedBloodType = blood_type.trim().toUpperCase();

        // Check duplicates
        const existing_bloodBank = await bloodBankModel.findOne({
            blood_type: normalizedBloodType,
            _id: { $ne: id }
        });

        if (existing_bloodBank) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.BLOODBANK_EXISTS);
        }

        // Update bloodbank
        bloodBank.blood_type = normalizedBloodType;
        bloodBank.available_unit = available_unit;

        const updatedbloodBank = await bloodBank.save();

        return successResponse(
            res,
            STATUS.OK,
            { bloodBank: updatedbloodBank },
            MESSAGES.BLOODBANK.BLOODBANK_UPDATED
        );
    }
    catch (error) {
        console.log("error:", error)
        // Check for Mongoose validation error
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message);
            return errorResponse(res, STATUS.BAD_REQUEST, messages.join(", "));
        }
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   DELETE /api/bloodBank/delete/:id
// @desc    Delete blood bank 
// @access Admin/staff 
export const deleteBloodBank = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.INVALID_BLOODBANK_ID);
        }
        // to delete
        const bloodBank = await bloodBankModel.findByIdAndDelete(id)
        if (!bloodBank) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANK.BLOODBANK_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { bloodBank },
            MESSAGES.BLOODBANK.BLOODBANK_DELETED
        )
    }
    catch (error) {
        console.error("delete Bloodbank Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

