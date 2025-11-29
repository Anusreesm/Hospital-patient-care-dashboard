import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import { errorResponse } from "../constants/response.js";
import patientModel from "../models/Patient.js";
import userModel from "../models/User.js";

// to add patient details
export const validateAddPatient = async (req, res, next) => {
    let { user_id,
        name,
        addresses,
        phone,
        age,
        email,
        gender,
        bloodType,
        emergency_name,
        emergency_contact,
        registration } = req.body


    // 1️ Required fields check
    if (!user_id || !name || !addresses || !phone || !age || !email || !gender || !bloodType) {
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


    const existingUser = await userModel.findOne({ email });

    if (existingUser) {

        // Check if a patient exists for this user
        const existingPatient = await patientModel.findOne({ user_id: existingUser._id });

        if (!existingPatient) {
            // email exists but no patient → invalid
            return errorResponse(res, STATUS.BAD_REQUEST, "Email found but patient record missing");
        }

        // email & patient exist → OK (registration scenario)
        req.existingUser = existingUser;
        req.existingPatient = existingPatient;
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


// to update patient
// export const validateUpdatePatient = async (req, res, next) => {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.INVALID_PATIENT_ID);
//     }

//     const patientDetails = await patientModel.findById(id);
//     if (!patientDetails) {
//         return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.PATIENT.PATIENT_NOT_FOUND);
//     }

//     // Extract nested payload
//     const patient = req.body.patient || {};
//     const address = req.body.address || {};
//     const reg = req.body.reg || {};
//     const user = req.body.user || {};

//     // PATIENT UPDATE FIELDS
//     const updatePatientDetails = {};
//     if (patient.name) updatePatientDetails.name = patient.name;
//     if (patient.phone) updatePatientDetails.phone = patient.phone;
//     if (patient.age) updatePatientDetails.age = patient.age;
//     if (patient.gender) updatePatientDetails.gender = patient.gender;
//     if (patient.bloodType) updatePatientDetails.bloodType = patient.bloodType;
//     if (patient.emergency_name) updatePatientDetails.emergency_name = patient.emergency_name;
//     if (patient.emergency_contact) updatePatientDetails.emergency_contact = patient.emergency_contact;


//     // ADDRESS UPDATE FIELDS
//     const updateAddressDetails = {};
//     if (address.street) updateAddressDetails.street = address.street;
//     if (address.city) updateAddressDetails.city = address.city;
//     if (address.state) updateAddressDetails.state = address.state;
//     if (address.country) updateAddressDetails.country = address.country;
//     if (address.pincode) updateAddressDetails.pincode = address.pincode;

//     // REG UPDATE FIELDS
//     const updateRegDetails = {};
//     if (reg.medical_condition) updateRegDetails.medical_condition = reg.medical_condition;
//     if (reg.allergies) updateRegDetails.allergies = reg.allergies;
//     if (reg.status) updateRegDetails.status = reg.status;
//     if (reg.registration_date) updateRegDetails.registration_date = reg.registration_date;
//     if (reg.discharge_date) updateRegDetails.discharge_date = reg.discharge_date;

//     // USER UPDATE FIELDS
//     const userUpdates = {};
//     if (user.email && user.email.toLowerCase() !== patientDetails.email) {
//         userUpdates.email = user.email.toLowerCase();
//     }

//     if (user.name) userUpdates.name = user.name.trim();

//     // Attach to req
//     req.updatePatientDetails = updatePatientDetails;
//     req.updateAddressDetails = updateAddressDetails;
//     req.updateRegDetails = updateRegDetails;
//     req.userUpdates = userUpdates;
// console.log("REQ.BODY RECEIVED:", req.body);
// console.log("USER UPDATES BUILT:", userUpdates);

//     next();
// };
export const validateUpdatePatient = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.INVALID_PATIENT_ID);
    }

    const patientDetails = await patientModel.findById(id);
    if (!patientDetails) {
        return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.PATIENT.PATIENT_NOT_FOUND);
    }
   

    // Frontend sends flat keys: updatePatientDetails, updateAddressDetails, updateRegDetails, userUpdates
    const {
        updatePatientDetails = {},
        updateAddressDetails = {},
        updateRegDetails = {},
        userUpdates = {}
    } = req.body;

    // Attach to request
    req.updatePatientDetails = updatePatientDetails;
    req.updateAddressDetails = updateAddressDetails;
    req.updateRegDetails = updateRegDetails;
    req.userUpdates = userUpdates;

     

    console.log("REQ.BODY RECEIVED:", req.body);

    next();
};

export const validateDeletePatient = (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.INVALID_PATIENT_ID);
    }
    next();
}