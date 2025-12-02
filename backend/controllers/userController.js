import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js"
import userModel from "../models/User.js"
import bcrypt from "bcrypt"
import generateToken from "../utils/generateToken.js"
import hospitalStaffModel from "../models/HospitalStaff.js";
import crypto from "crypto";
import EmailTempForTempPw from "../utils/emails/templates/emailTemplatesForTempPw.js";
import SendMail from "../utils/emails/sendMail.js";
import { EmailTempForResetPw } from "../utils/emails/templates/emailTemplateForResetPwLink.js";
// @desc Register new patient
// @route POST/api/users/register
// @access Public 
// not needed-Currently, all hospital staff and patient accounts are created by Admin via
export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body
        // to  check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.EMAIL_EXISTS);
        }
        // to create User
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            name,
            role: "admin",
            // hardcoded patient

        });
        // to generate token
        const token = generateToken(newUser._id, newUser.role, newUser.name);
        return successResponse(
            res,
            STATUS.OK,
            {
                _id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                name: newUser.name,
                token,
            },
            MESSAGES.USER.USER_REGISTERED
        )

    }
    catch (error) {
        console.error("Register User Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @desc login user
// @route POST/api/users/login
// @access Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        // To find User
        const user = await userModel.findOne({ email })
        if (!user) {
            return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.USER.USER_NOT_FOUND)
        }
        // Check if user is active 
        if (user.status !== "active" || user.isActive === false) {
            return errorResponse(res, STATUS.FORBIDDEN, MESSAGES.ACCOUNT_INACTIVE);
        }
        // to check password
        const isVerify = await bcrypt.compare(password, user.password);
        if (!isVerify) {
            return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS)
        }

        // if (user.status !== "active") {
        //     return errorResponse(res, STATUS.FORBIDDEN, MESSAGES.ACCOUNT_INACTIVE);
        // }
        //  Update last login timestamp (non-blocking)
        user.lastLoginAt = new Date();
        await user.save();

        // use utility to generate token
        const token = generateToken(user._id, user.role, user.name)

        return successResponse(
            res,
            STATUS.OK,
            {
                _id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                token,
                lastLoginAt: user.lastLoginAt,
            },
            MESSAGES.USER.LOGIN_SUCCESS
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @desc get all users
// @route POST/api/users/
// @access Admin
export const getUsers = async (req, res) => {

    try {
        // To find All User
        const users = await userModel.find({ isActive: true })
        return successResponse(
            res,
            STATUS.OK,
            {
                users
            },
            MESSAGES.USER.USERS_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @desc GET single users
// @route GET/api/users/:id
// @access Admin/User
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.INVALID_USER_ID);
        }
        // to get single user by id
        const user = await userModel.findById(id)
        if (!user) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { user },
            MESSAGES.USER.USER_FETCHED
        )
    }
    catch (error) {
        // console.error("Error in getUserById:", error); 
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }

}

// @desc   update user
//          - Normal users can update only their email
//          - Admins can update email, role, and status
//          - Password is not updated here (use changeUserPassword)

// @route   PUT/api/users/update/:id
// @access Admin/User
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.INVALID_USER_ID);
        }
        // Destructure to separate sensitive fields
        let { password, role, status, ...otherDatas } = req.body



        // Only admin can update role or status
        if (!req.user || req.user.role !== "admin") {
            role = undefined;
            status = undefined;
        }
        // final payload
        const updatePayloads = { ...otherDatas }
        if (role) updatePayloads.role = role
        if (status) updatePayloads.status = status
        // if (typeof status === "string") {
        //     updatePayloads.isActive = status.toLowerCase() === "active";
        // }
        // to update user by id
        const user = await userModel.findByIdAndUpdate(
            id,
            updatePayloads,
            { new: true }
        )
        if (!user) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND);
        }
        // Update HospitalStaff linked to this user (if exists)
        if (user.role === "doctor" || user.role === "staff") {
            const updateFields = { isActive: user.isActive };
            console.log(updateFields)

            //  handle deletedAt for soft delete consistency
            if (user.isActive === true) {
                updateFields.deletedAt = null;
            } else {
                updateFields.deletedAt = new Date();
            }

            await hospitalStaffModel.findOneAndUpdate(
                { user_id: user._id },
                updateFields,
                { new: true }
            );
        }
        return successResponse(
            res,
            STATUS.OK,
            { user },
            MESSAGES.USER.USER_UPDATED
        )
    }
    catch (error) {
        // console.error("Error in updateUser:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @desc  delete user
// @route   DELETE/api/users/delete/:id
// @access Admin/User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.INVALID_USER_ID);
        }
        // to delete
        const user = await userModel.findById(id)
        if (!user || !user.isActive) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND);
        }
        user.isActive = false;
        user.deletedAt = new Date();
        user.status = "deactivated"
        await user.save();
        // Soft delete from hospitalStaff 
        await hospitalStaffModel.findOneAndUpdate(
            { user_id: user._id },
            { isActive: false, deletedAt: new Date() }
        );
        return successResponse(
            res,
            STATUS.OK,
            { user },
            MESSAGES.USER.USER_DELETED
        )
    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @desc Change user active/inactive status
// @route    PATCH /api/users/status/:id
// @access Admin
export const changeUserStatus = async (req, res) => {
    try {
        const { id } = req.params

        //Check if the id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.INVALID_USER_ID);
        }

        // Find the user from the database
        const user = await userModel.findById(id)
        // If no user is found
        if (!user) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND);
        }

        // Toggle status
        user.status = user.status === "active" ? "deactivated" : "active";
        await user.save({ validateBeforeSave: false });


        return successResponse(
            res,
            STATUS.OK,
            { status: user.status },
            MESSAGES.USER.USER_STATUS_CHANGED
        )
    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @desc     Change user password-needs both oldPassword and newPassword
// @route   PATCH /api/users/password/:id
// @access Admin/User -inside dashboard
export const changeUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        // check if the id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(
                res,
                STATUS.BAD_REQUEST,
                MESSAGES.USER.INVALID_USER_ID
            )
        }
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.BOTH_PASSWORDS_REQUIRED);
        }
        // // find user
        const user = await userModel.findById(id)
        // If no user is found
        if (!user) {
            return errorResponse(
                res,
                STATUS.NOT_FOUND,
                MESSAGES.USER.USER_NOT_FOUND);
        }
        // compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.INVALID_OLD_PASSWORD);
        }

        // set new password 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword
        await user.save();

        return successResponse(
            res,
            STATUS.OK,
            null,
            MESSAGES.USER.PASSWORD_UPDATED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }

}

// @desc    Send reset-password link to user's email
// @route   POST /api/users/forgotPassword
// @access  Public

export const forgotUserPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND)
        }
        // Generate Token
        const token = crypto.randomBytes(32).toString("hex")
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000 //1 hour
        await user.save()
        // const resetLink = `http://localhost:5173/reset-password/${token}`;
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        const emailContent = EmailTempForResetPw({
            toEmail: email,
            name: user.name,
            role: user.role,
            resetLink
        });

        await SendMail(email, emailContent);

        return successResponse(res, STATUS.OK, MESSAGES.USER.RESET_LINK)

    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @desc     reset-password 
// @route   POST /api/users/resetPassword/:token
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        })
        if (!user) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.INVALID_EXPIRED)
        }
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        user.resetPasswordToken = null
        user.resetPasswordExpires = null
        await user.save()
        return successResponse(res, STATUS.OK, MESSAGES.USER.PASSWORD_RESET)
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route GET/api/users/check-email/:email
// desc Check email duplicates
// @access admin
export const checkEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.INVALID_EMAIL);
        }
        const existingUser = await userModel.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return errorResponse(res, STATUS.CONFLICT, MESSAGES.USER.EMAIL_EXISTS);
        }
        return successResponse(res, STATUS.OK, MESSAGES.USER.EMAIL_AVAILABLE);
    } catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
    }
};