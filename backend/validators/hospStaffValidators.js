import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import { errorResponse } from "../constants/response.js";
import userModel from "../models/User.js";

export const ValidateAddHospStaff = async (req, res, next) => {
    let { email, dept_id, name, phone, medical_license, exp_years, specialization_id } = req.body
    // required field checks
    if (!email || !dept_id || !name || !phone) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.HOSP_STAFF.REQUIRED_FIELDS);
    }
    const phoneStr = String(phone);  // local variable
    if (!/^\d{10}$/.test(phoneStr)) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.PHONE_INVALID);
    }
    req.phoneStr = phoneStr; // attach to req for controller
    // Validate experience
    if (exp_years < 0) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.INVALID_NUMBER);
    }
    //  Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.EMAIL_EXISTS);
    }
    next();
}