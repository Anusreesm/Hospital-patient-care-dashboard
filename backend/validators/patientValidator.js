import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import { errorResponse } from "../constants/response.js";
import patientModel from "../models/Patient.js";
import userModel from "../models/User.js";

// to add patient details
export const validateAddPatient = async(req, res, next) => {
    let { user_id, 
        name, 
        addresses, 
        phone, 
        age, 
        email, 
        gender,
         bloodBank_id, 
         emergency_name,
          emergency_contact,
        registration } = req.body

          // 1️ Required fields check
    if (!user_id || !name || !addresses || !phone || !age || !email || !gender || !bloodBank_id) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.REQUIRED_FIELDS);
    }
       // 2️ Validate name
    name = name.trim();
    if (name.length < 2 || name.length > 50) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.PATIENT_NAME_LONG)
    }
    //3 Check each character
        if (!/^[A-Za-z\s\-]+$/.test(name)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.INVALID_CHARACTERS);
    }
    //4 phone number check
    const phoneStr = String(phone);
    if (!/^\d{10}$/.test(phoneStr)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.PHONE_INVALID);
    }

 // 4️ Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.EMAIL_INVALID);
    }

     // 5**Check if email already exists**
    const existingUser =await  userModel.findOne({ email: email });
    if (existingUser) {
        return errorResponse(res, STATUS.BAD_REQUEST, "Email already exists");
    }
     // 6️ Validate addresses object
    if (
        !addresses.street ||
        !addresses.city ||
        !addresses.state ||
        !addresses.country ||
        !addresses.pincode
    ) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.ADDRESS.REQUIRED_FIELDS);
    }
    if (!/^\d{6}$/.test(addresses.pincode)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.PINCODE_INVALID);
    }

  // 7️ Optional: validate registration object
    if (registration) {
        if (!registration.medical_condition) {
            return errorResponse(res, STATUS.BAD_REQUEST, "Medical condition is required");
        }
    }


    next();
}



//  to get patient by id
export const validateGetPatientById = (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.INVALID_PATIENT_ID);
    }
    next();
}


// to update patient details
export const validateUpdatePatient = async (req, res, next) => {
    const { id } = req.params
    const { user_id, name, addresses_id, phone, age, gender, bloodBank_id, emergency_name, emergency_contact } = req.body
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.INVALID_PATIENT_ID);
    }
    // Find patientdetails record first
    const patientDetails = await patientModel.findById(id);
    if (!patientDetails) {
        return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.PATIENT.PATIENT_NOT_FOUND);
    }

    const updatePatientDetails = {};
    // Check each field from the request body
    // if(user_id)updatePatientDetails.user_id=user_id
    if (name) updatePatientDetails.name = name
    if (addresses_id) updatePatientDetails.addresses_id = addresses_id;
    if (phone) updatePatientDetails.phone = phone;
    if (age) updatePatientDetails.age = age;
    if (gender) updatePatientDetails.gender = gender;
    if (bloodBank_id) updatePatientDetails.bloodBank_id = bloodBank_id;
    if (emergency_name) updatePatientDetails.emergency_name = emergency_name;
    if (emergency_contact) updatePatientDetails.emergency_contact = emergency_contact;

    // Check if at least one field is provided
    if (Object.keys(updatePatientDetails).length === 0) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.REQUIRED_FIELDS);
    }
    // Pass the update object to the controller
    req.updatePatientDetails = updatePatientDetails;
    next();
}


// to delete patient
export const validateDeletePatient = (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.INVALID_PATIENT_ID);
    }
    next();
}