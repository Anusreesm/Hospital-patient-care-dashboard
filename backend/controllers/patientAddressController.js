
import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js";
import addressModel from "../models/Addresses.js";

// @route   POST/api/patientAddress/create
// @desc    add Patient Address
// @access Admin/staff 
export const addPatientAddress = async (req, res) => {
    try {
        const { street, city, state, country, pincode } = req.body
        if (!street || !city || !state || !country || !pincode) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.ADDRESS.REQUIRED_FIELDS);
        }
        // to create patient Address
        const address = await addressModel.create({
            street,
            city,
            state,
            country,
            pincode
        });
        return successResponse(
            res,
            STATUS.OK,
            {
                _id: address._id,
                city: address.city,
                street: address.street,
                country: address.country,
                pincode: address.pincode,
            },
            MESSAGES.ADDRESS.ADDRESS_CREATED
        )
    }
    catch (error) {
        console.error("create Address Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/patientAddress/
// @desc   GET all patient Address
// @access Admin/staff 
export const getPatientAddress = async (req, res) => {
    try {
        // To find All address
        const address = await addressModel.find()
        return successResponse(
            res,
            STATUS.OK,
            {
                address
            },
            MESSAGES.ADDRESS.ADDRESSES_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}
// @route   GET/api/patientAddress/:id
// @desc   GET single  Address by id
// @access Admin/staff 
export const getPatientAddressById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.ADDRESS.INVALID_ADDRESS_ID);
        }
        // to get single ADDRESS  by id
        const address = await addressModel.findById(id)
        if (!address) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.ADDRESS.ADDRESS_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { address },
            MESSAGES.ADDRESS.ADDRESS_FETCHED
        )
    }
    catch (error) {

        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}
// @route   PUT/api/patientAddress/update/:id
// @desc   update patient Address
// @access Admin/staff 
export const updatePatientAddress = async (req, res) => {
    try {
        const { id } = req.params
        const { street, city, state, country, pincode } = req.body

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.ADDRESS.INVALID_ADDRESS_ID);
        }

        // Build dynamic update object
        const updateData = {};
        // Check each field from the request body
        if (street) updateData.street = street;
        if (city) updateData.city = city;
        if (state) updateData.state = state;
        if (country) updateData.country = country;
        if (pincode) updateData.pincode = pincode;

        // Check if at least one field is provided
        if (Object.keys(updateData).length === 0) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.ADDRESS.REQUIRED_FIELDS);
        }
        // updateAddress
        const updatedAddress = await addressModel.findByIdAndUpdate(
            id,
            // $set update only the provided fields in the database.
           { $set: updateData },
            { new: true }
        )
        if (!updatedAddress) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.ADDRESS.ADDRESS_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { address: updatedAddress },
            MESSAGES.ADDRESS.ADDRESS_UPDATED
        );
    }
    catch (error) {
        console.error("update PATIENT ADDRESS Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   DELETE/api/patientAddress/delete/:id
// @desc   delete address
// @access Admin/staff 
export const deletePatientAddress = async(req, res) => {
 try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.ADDRESS.INVALID_ADDRESS_ID);
        }
        // to delete
        const address = await addressModel.findByIdAndDelete(id)
        if (!bloodBank) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.ADDRESS.ADDRESS_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { bloodBank },
            MESSAGES.ADDRESS.ADDRESS_DELETED
        )
    }
    catch (error) {
        console.error("delete Bloodbank Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

