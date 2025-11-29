
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
        const { blood_type, available_unit } = req.body;
        const existing = await bloodBankModel.findOne({ blood_type });

        if (existing) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.BLOODBANK_EXISTS);
        }

        // Validate available units
        if (available_unit <= 0) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.AVAIL_UNITS_NOT_ZERO_NEGATIVE);
        }
        if (available_unit > 100) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK.AVAIL_UNITS_CANNOT_EXCEED_HUNDRED);
        }

        const bloodBank = await bloodBankModel.create({
            blood_type,
            available_unit,
        });

        return successResponse(
            res,
            STATUS.OK,
            { bloodBank },
            MESSAGES.BLOODBANK.BLOODBANK_CREATED
        );
    } catch (error) {
        console.error("create BLOOD BANK Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
    }
};


// @route   GET /api/bloodBank
// @desc    Get all blood bank 
// @access Admin/staff 
export const getBloodBank = async (req, res) => {
    try {
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
        console.error("get BLOOD BANK Error:", error);
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
        console.error("create BLOOD BANK Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   PUT /api/bloodBank/update/:id
// @desc    Update blood bank (partial update allowed)-master stock adjustment- replace the old stock
// @access Admin
export const updateBloodBank = async (req, res) => {
    try {
        const { id } = req.params;
        const { blood_type, available_unit } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(
                res,
                STATUS.BAD_REQUEST,
                MESSAGES.BLOODBANK.INVALID_BLOODBANK_ID
            );
        }

        // Check if exists
        const existing = await bloodBankModel.findById(id);
        if (!existing) {
            return errorResponse(
                res,
                STATUS.NOT_FOUND,
                MESSAGES.BLOODBANK.BLOODBANK_NOT_FOUND
            );
        }

        // Prepare update data
        const updateData = {};

        // Validate & update blood_type if provided
        if (blood_type) {
            const existingType = await bloodBankModel.findOne({ blood_type });

            // Prevent duplicate master entries for same blood type
            if (existingType && existingType._id.toString() !== id.toString()) {
                return errorResponse(
                    res,
                    STATUS.BAD_REQUEST,
                    MESSAGES.BLOODBANK.BLOODTYPE_EXISTS
                );
            }

            updateData.blood_type = blood_type;
        }

        // Validate & update units if provided
        if (available_unit !== undefined) {
            if (available_unit < 0) {
                return errorResponse(
                    res,
                    STATUS.BAD_REQUEST,
                    MESSAGES.BLOODBANK.AVAIL_UNITS_NOT_ZERO_NEGATIVE

                );
            }

            if (available_unit > 100) {
                return errorResponse(
                    res,
                    STATUS.BAD_REQUEST,
                    MESSAGES.BLOODBANK.AVAIL_UNITS_CANNOT_EXCEED_HUNDRED

                );
            }

            updateData.available_unit = available_unit;
        }

        // Update master record
        const updated = await bloodBankModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return successResponse(
            res,
            STATUS.OK,
            updated,
            MESSAGES.BLOODBANK.BLOODBANK_UPDATED
        );

    } catch (error) {
        console.error("Update BLOOD BANK Error:", error);
        return errorResponse(
            res,
            STATUS.INTERNAL_SERVER_ERROR,
            MESSAGES.SERVICE_ERROR
        );
    }
};

// @route   DELETE /api/bloodBank/delete/:id
// @desc    Delete blood bank 
// @access Admin/staff 
export const deleteBloodBank = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(
                res,
                STATUS.BAD_REQUEST,
                MESSAGES.BLOODBANK.INVALID_BLOODBANK_ID
            );
        }

        // Find blood group
        const bloodBank = await bloodBankModel.findById(id);

        if (!bloodBank) {
            return errorResponse(
                res,
                STATUS.NOT_FOUND,
                MESSAGES.BLOODBANK.BLOODBANK_NOT_FOUND
            );
        }

        // Reset stock to zero
        bloodBank.available_unit = 0;

        await bloodBank.save();

        return successResponse(
            res,
            STATUS.OK,
            { bloodBank },
            MESSAGES.BLOODBANK.RESET_TO_ZERO
        );
    }
    catch (error) {
        console.error("DELETE BLOOD BANK Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

