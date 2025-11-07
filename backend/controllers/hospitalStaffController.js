
import mongoose from "mongoose"
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js"
import deptModel from "../models/DepartmentMaster.js"
import hospitalStaffModel from "../models/HospitalStaff.js"
import { staffByIdQuery, staffQuery } from "../services/hospStaffService.js"
import userModel from "../models/User.js"
import crypto from "crypto";
import bcrypt from "bcrypt"



import SendMail from "../utils/emails/sendMail.js"
import createUserWithTempPw from "../utils/createUserWithTempPw.js"
import EmailTempForTempPw from "../utils/emails/templates/emailTemplatesForTempPw.js"

// @route   POST/api/hospStaff/register
// @desc    create new staff
// @access  Admin
export const registerhospStaff = async (req, res) => {
    try {
        let { email, dept_id, name, phone, medical_license, exp_years, specialization_id } = req.body
        // Fetch the department from DB
        const department = await deptModel.findById(dept_id);
        if (!department) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.DEPARTMENT.INVALID_DEPT_ID)
        }
          //  phone number includes +91 
        if (phone && !phone.startsWith("+91")) {
            phone = `+91${phone.replace(/^\+?91/, "").trim()}`;
        }
        //  Determine role based on department  (case-insensitive) 
        let role = "staff";
       if (/doctor/i.test(department.dept_name)) {
            role = "doctor";
            // Doctor-specific validation
            if (!specialization_id || !medical_license) {
                return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.DOCTORS.DOC_DETAILS_REQUIRED)
            }
        }
        // Generating temp password

        const { newUser, tempPassword } = await createUserWithTempPw(email, role, name);
        // Create HospitalStaff  linked to User model
        const hosp_staff = await hospitalStaffModel.create({
            user_id: newUser._id,
            dept_id,
            name: name.trim(),
            phone,
            medical_license: medical_license || null,          // empty string to null
            exp_years: exp_years === "" ? null : exp_years,   // only convert "" to null
            specialization_id: specialization_id || null,    // empty string to null
            isActive: true,
        });
console.log("Sending email to:", email, "with name:", name);

        // Send temp password email
        const emailContent = EmailTempForTempPw({ toEmail: email, tempPassword, role,name });
        // sending email and displaying email is on emailcontent
        await SendMail(email, emailContent);

        return successResponse(
            res,
            STATUS.OK,
            {
                _id: hosp_staff._id,
                user_id: hosp_staff.user_id,
                dept_id: hosp_staff.dept_id,
                name: hosp_staff.name,
                phone: hosp_staff.phone,
                exp_years: hosp_staff.exp_years,
                medical_license: hosp_staff.medical_license,
                specialization_id: hosp_staff.specialization_id,
                role: newUser.role,
                tempPassword // admin can provide to staff/doctor
            },
            MESSAGES.HOSP_STAFF.HOSP_STAFF_CREATED
        )
    }
    catch (error) {
        console.error("error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}
// @route   GET/api/hospStaff/
// @desc   GET all staff
// @access Admin
export const gethospStaff = async (req, res) => {
    try {
        // To find All hospital staffs
        const staffs = await staffQuery()
        return successResponse(
            res,
            STATUS.OK,
            {
                staffs
            },
            MESSAGES.HOSP_STAFF.HOSP_STAFFS_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/hospStaff/:id
// @desc   GET single staff
// @access Admin
export const gethospStaffById = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.HOSP_STAFF.INVALID_HOSP_STAFF_ID);
        }
        // to get single staff  by id
        // called from services
        const staff = await staffByIdQuery(id)
        if (!staff) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.HOSP_STAFF.HOSP_STAFF_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { staff },
            MESSAGES.HOSP_STAFF.HOSP_STAFF_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   PUT/api/hospStaff/update/:id
// @desc   update staff
// @access Admin
export const updatehospStaff = async (req, res) => {
    try {
        const { id } = req.params
        const { dept_id, name, phone, medical_license, exp_years, specialization_id, email } = req.body
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.HOSP_STAFF.INVALID_HOSP_STAFF_ID);
        }
        // Find hospital staff record first
        const staff = await hospitalStaffModel.findById(id);
        if (!staff || !staff.isActive) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.HOSP_STAFF.HOSP_STAFF_NOT_FOUND);
        }

        // Normalize fields (handle empty strings)
        const checkSpecializationId = specialization_id === "" ? null : specialization_id;
        const checkMedicalLicense = medical_license === "" ? null : medical_license;
        // Build dynamic update object
        const updateHospStaff = {};
        // Check each field from the request body

        if (dept_id) updateHospStaff.dept_id = dept_id;
        if (name) updateHospStaff.name = name.trim();
        if (phone) updateHospStaff.phone = phone;
        if (medical_license !== undefined) updateHospStaff.medical_license = checkMedicalLicense;
        if (exp_years !== undefined) updateHospStaff.exp_years = exp_years;
        if (specialization_id !== undefined) updateHospStaff.specialization_id = checkSpecializationId;


        // Check if at least one field is provided
        if (Object.keys(updateHospStaff).length === 0) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.HOSP_STAFF.REQUIRED_FIELDS);
        }
        // updateStaff
        const updatedStaff = await hospitalStaffModel.findByIdAndUpdate(
            id,
            // $set update only the provided fields in the database.
            { $set: updateHospStaff },
            { new: true }
        )
        if (!updatedStaff) {
            console.log(error)
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.HOSP_STAFF.HOSP_STAFF_NOT_FOUND);
        }

        // sync to userModel
        const userUpdates = {};
        if (email) userUpdates.email = email.toLowerCase();
        if (name) userUpdates.name = name.trim();
        if (phone) userUpdates.phone = phone;
        if (dept_id) {
            const dept = await deptModel.findById(dept_id);
            if (dept) {
                if (/^doctor$/i.test(dept.dept_name)) {
                    userUpdates.role = "doctor";
                    // Doctor-specific validation
                    if (!checkSpecializationId || !checkMedicalLicense) {
                        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.DOCTORS.DOC_DETAILS_REQUIRED);
                    }
                } else {
                    userUpdates.role = "staff";
                }
            }
        }
        //  Only update user if role and email,changed
        if (Object.keys(userUpdates).length > 0) {
            await userModel.findByIdAndUpdate(staff.user_id, { $set: userUpdates });
        }
        return successResponse(
            res,
            STATUS.OK,
            { staff: updatedStaff },
            MESSAGES.HOSP_STAFF.HOSP_STAFF_UPDATED
        );
    }
    catch (error) {
        console.error("update staff Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   DELETE/api/hospStaff/delete/:id
// @desc   delete staff
// @access admin
export const deletehospStaff = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.HOSP_STAFF.INVALID_HOSP_STAFF_ID);
        }
        // to delete from staff
        const staff = await hospitalStaffModel.findById(id)
        if (!staff || !staff.isActive) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.HOSP_STAFF.HOSP_STAFF_NOT_FOUND);
        }
        staff.isActive = false;
        staff.deletedAt = new Date();
        await staff.save();
        
        await userModel.findByIdAndUpdate(staff.user_id, { status: "deactivated" });
        return successResponse(
            res,
            STATUS.OK,
            { deletedStaffId: staff._id },
            MESSAGES.HOSP_STAFF.HOSP_STAFF_DELETED
        )
    }
    catch (error) {
        console.error("delete staff Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

