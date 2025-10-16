import mongoose from "mongoose";
import { MESSAGES } from "../constants/messages.js"
import { STATUS } from "../constants/httpStatus.js";
import { errorResponse, successResponse } from "../constants/response.js";
import specializationModel from "../models/SpecializationMaster.js";

// @route   POST/api/specializationMaster/create
// @desc    create new Specialization
// @access Admin/staff 
export const createSpecialization = async (req, res) => {
    try {
        const { spec_name } = req.body
        if (!spec_name || !spec_name.trim()) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.SPECIALIZATION.SPEC_NAME_REQUIRED);
        }
        //  to check if specialization already exist
        const existing_Spec = await specializationModel.findOne({ spec_name: { $regex: `^${spec_name.trim()}$`, $options: "i" } });
        if (existing_Spec) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.SPECIALIZATION.SPEC_EXISTS);
        }
        // to create specialization
        const newSpec = await specializationModel.create({
            spec_name
        });
        return successResponse(
            res,
            STATUS.OK,
            {
                _id: newSpec._id,
                spec_name: newSpec.spec_name,
            },
            MESSAGES.SPECIALIZATION.SPEC_CREATED
        )
    }
    catch (error) {
        console.error("create spec Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/specializationMaster/
// @desc   GET all Specialization
// @access Admin/staff 
export const getSpecialization = async (req, res) => {
    try {
        // To find All specialization
        const spec = await specializationModel.find()
        return successResponse(
            res,
            STATUS.OK,
            {
                spec
            },
            MESSAGES.SPECIALIZATION.SPEC_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}
// @route   GET/api/specializationMaster/:id
// @desc   GET single Specialization
// @access Admin/staff 
export const getSpecializationById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.SPECIALIZATION.INVALID_SPEC_ID);
        }
        // to get single dept  by id
        const spec = await specializationModel.findById(id)
        if (!spec) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.SPECIALIZATION.SPEC_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { spec },
            MESSAGES.SPECIALIZATION.SPEC_FETCHED
        )
    }
    catch (error) {

        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   PUT/api/specializationMaster/update/:id
// @desc   update Specialization
// @access Admin/staff 
export const updateSpecialization = async (req, res) => {
    try {
        const { id } = req.params
        const { spec_name } = req.body;
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.SPECIALIZATION.INVALID_SPEC_ID);
        }
        // Check if spec_name is provided
        if (!spec_name || !spec_name.trim()) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.SPECIALIZATION.SPEC_NAME_REQUIRED);
        }

        // Check if Specialization exists
        const spec = await specializationModel.findById(id);
        if (!spec) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.SPECIALIZATION.SPEC_NOT_FOUND);
        }
        // Case-insensitive duplicate check (excluding current Specialization)
        const existing_Spec = await specializationModel.findOne({
            spec_name: { $regex: `^${spec_name.trim()}$`, $options: "i" },
            _id: { $ne: id } // exclude current dept-ignore the current Specialization when checking for duplicates.
        });
        if (existing_Spec) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.SPECIALIZATION.SPEC_EXISTS);
        }

        // Update Specialization
        spec.spec_name = spec_name.trim();
        const updatedSpec = await spec.save();

        return successResponse(
            res,
            STATUS.OK,
            { spec: updatedSpec },
            MESSAGES.SPECIALIZATION.SPEC_UPDATED
        );
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   DELETE/api/specializationMaster/delete/:id
// @desc   delete Specialization
// @access Admin/staff 
export const deleteSpecialization = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.SPECIALIZATION.INVALID_SPEC_ID);
        }
        // to delete
        const spec = await specializationModel.findByIdAndDelete(id)
        if (!spec) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.SPECIALIZATION.SPEC_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { spec },
            MESSAGES.SPECIALIZATION.SPEC_DELETED
        )
    }
    catch (error) {
        console.error("delete spec Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

