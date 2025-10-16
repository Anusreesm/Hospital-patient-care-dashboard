import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import { errorResponse } from "../constants/response.js";
import patientDetailsModel from "../models/PatientDetails.js";

// to add patient details
export const validateAddPatientDetails = (req, res, next) => {
    const { addresses_id, phone, age, gender, bloodBank_id, emergency_name, emergency_contact } = req.body
    if (!addresses_id || !phone || !age || !gender || !bloodBank_id) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT_DETAILS.REQUIRED_FIELDS);
    }
    // phone number check
    const phoneStr = String(phone);
    if (!/^\d{10}$/.test(phoneStr)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.PHONE_INVALID);
    }
    next();
}

// to get patient details by id
export const validateGetPatientDetailsById = (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT_DETAILS.INVALID_PATIENT_DETAILS_ID);
    }
    next();
}


// to update patient details
export const validateUpdatePatientDetails = async (req, res, next) => {
    const { id } = req.params
    const { addresses_id, phone, age, gender, bloodBank_id, emergency_name, emergency_contact } = req.body
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT_DETAILS.INVALID_PATIENT_DETAILS_ID);
    }
    // Find patientdetails record first
    const patientDetails = await patientDetailsModel.findById(id);
    if (!patientDetails) {
        return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.PATIENT_DETAILS.PATIENT_DETAILS_NOT_FOUND);
    }

    const updatePatientDetails = {};
    // Check each field from the request body

    if (addresses_id) updatePatientDetails.addresses_id = addresses_id;
    if (phone) updatePatientDetails.phone = phone;
    if (age) updatePatientDetails.age = age;
    if (gender) updatePatientDetails.gender = gender;
    if (bloodBank_id) updatePatientDetails.bloodBank_id = bloodBank_id;
    if (emergency_name) updatePatientDetails.emergency_name = emergency_name;
    if (emergency_contact) updatePatientDetails.emergency_contact = emergency_contact;

    // Check if at least one field is provided
    if (Object.keys(updatePatientDetails).length === 0) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT_DETAILS.REQUIRED_FIELDS);
    }
    // Pass the update object to the controller
    req.updatePatientDetails = updatePatientDetails;
    next();
}
export const validateDeletePatientDetails = (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT_DETAILS.INVALID_PATIENT_DETAILS_ID);
    }
    next();
}