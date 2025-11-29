
import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js";

import bloodBankDonorModel from "../models/BloodBankDonor.js";
import bloodBankModel from "../models/BloodBankMaster.js";
// DONOR

// @route   POST /api/bloodBankDonor/create
// @desc    Create new blood bank 
// @access Admin/staff 
export const createBloodBankDonor = async (req, res) => {
    try {
          console.log("Request body:", req.body);
        const { donor_name, phone, blood_type, available_unit, date } = req.body
        // Check duplicate entry
        const existing = await bloodBankDonorModel.findOne({ donor_name, blood_type, date });
        if (existing) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANKDONOR.BLOODBANKDONOR_EXISTS);
        }
        // Validate available units
        if (available_unit <= 0) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANKDONOR.AVAIL_UNITS_NOT_ZERO_NEGATIVE);
        }
        if (available_unit > 100) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANKDONOR.AVAIL_UNITS_CANNOT_EXCEED_HUNDRED);
        }
        if (phone) {
            if (!/^\d{1,10}$/.test(phone)) {
                return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.PHONE_INVALID);
            }

        }
        if (date) {
            const today = new Date();
            const inputDate = new Date(date);
            today.setHours(0, 0, 0, 0);
            if (inputDate < today) {
                return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANKDONOR.DATE_CANNOT_PAST);
            }
        }
        // to create bloodbank
        const bloodBank = await bloodBankDonorModel.create({
            donor_name,
            phone,
            blood_type,
            available_unit,
            date
        });
        return successResponse(
            res,
            STATUS.OK,
            {
                _id: bloodBank._id,
                donor_name: bloodBank.donor_name,
                phone: bloodBank.phone,
                blood_type: bloodBank.blood_type,
                available_unit: bloodBank.available_unit,
                date: bloodBank.date
            },
            MESSAGES.BLOODBANKDONOR.BLOODBANKDONOR_CREATED
        )
    }
    catch (error) {
        console.error("create BLOOD BANK Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET /api/bloodBankDonor
// @desc    Get all blood bank 
// @access Admin/staff 
export const getBloodBankDonor = async (req, res) => {
    try {
        // To find All Bloodbanks
        const bloodBank = await bloodBankDonorModel.find()
        return successResponse(
            res,
            STATUS.OK,
            {
                bloodBank
            },
            MESSAGES.BLOODBANKDONOR.BLOODBANKDONORS_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET /api/bloodBankDonor/:id
// @desc    Get single blood bank 
// @access Admin/staff 
export const getBloodBankDonorById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANKDONOR.INVALID_BLOODBANKDONOR_ID);
        }
        // to get single bloodBank  by id
        const blood_Bank = await bloodBankDonorModel.findById(id)
        if (!blood_Bank) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANKDONOR.BLOODBANKDONOR_NOT_FOUND);
        }

        return successResponse(
            res,
            STATUS.OK,
            { blood_Bank },
            MESSAGES.BLOODBANKDONOR.BLOODBANKDONOR_FETCHED
        )
    }
    catch (error) {

        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   PUT /api/bloodBankDonor/update/:id
// @desc    Update blood bank (partial update allowed)
// @access Admin/staff 
export const updateBloodBankDonor = async (req, res) => {
    try {
        const { id } = req.params;
        const { donor_name, phone, blood_type, available_unit, date, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANKDONOR.INVALID_BLOODBANKDONOR_ID);
        }

        const donor = await bloodBankDonorModel.findById(id);
        if (!donor) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANKDONOR.BLOODBANKDONOR_NOT_FOUND);
        }

        const oldStatus = donor.status;
        const oldBloodType = donor.blood_type;

        // Update donor fields
        if (donor_name) donor.donor_name = donor_name;
        if (phone) {
            if (!/^\d{1,10}$/.test(phone)) {
                return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.PHONE_INVALID);
            }
            donor.phone = phone;
        }
        if (blood_type) donor.blood_type = blood_type.trim().toUpperCase();
        if (available_unit !== undefined) donor.available_unit = available_unit;
        if (date) donor.date = new Date(date);
        if (status) donor.status = status.toUpperCase();

        // Save donor
        const updatedDonor = await donor.save();

        // Increment master only if status changed to COMPLETED
        if (status && status.toUpperCase() === "COMPLETED" && oldStatus !== "COMPLETED") {
            const master = await bloodBankModel.findOne({ blood_type: donor.blood_type });
            if (master) {
                master.available_unit += donor.available_unit; // add donor units
                await master.save();
            } else {
                await bloodBankModel.create({
                    blood_type: donor.blood_type,
                    available_unit: donor.available_unit
                });
            }
        }

        return successResponse(
            res,
            STATUS.OK,
            { bloodBank: updatedDonor },
            MESSAGES.BLOODBANKDONOR.BLOODBANKDONOR_UPDATED
        );



    } catch (error) {
        console.log("Update BloodBank Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
    }
};


// @route   DELETE /api/bloodBankDonor/delete/:id
// @desc    Delete blood bank 
// @access Admin/staff 
export const deleteBloodBankDonor = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST,MESSAGES.BLOODBANKDONOR.INVALID_BLOODBANKDONOR_ID);
        }

        const donor = await bloodBankDonorModel.findById(id);
        if (!donor) {
            return errorResponse(res, STATUS.NOT_FOUND,MESSAGES.BLOODBANKDONOR.BLOODBANKDONOR_NOT_FOUND);
        }

        // If donor is COMPLETED, reduce master units
        if (donor.status === "COMPLETED") {
            const master = await bloodBankModel.findOne({ blood_type: donor.blood_type });
            if (master) {
                master.available_unit -= donor.available_unit;

                if (master.available_unit < 0) master.available_unit = 0;

                await master.save();
            }
        }

        // Delete donor
        await bloodBankDonorModel.findByIdAndDelete(id);

        return successResponse(res, STATUS.OK, {}, MESSAGES.BLOODBANKDONOR.BLOODBANKDONOR_DELETED);
    }
    catch (error) {
        console.error("delete Bloodbank Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

