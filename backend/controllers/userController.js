import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js"
import userModel from "../models/User.js"
import bcrypt from "bcrypt"
import generateToken from "../utils/generateToken.js"

// @desc Register new user
// @route POST/api/users/register
// @access Public 
export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body
        // to  check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.EMAIL_EXISTS);
        }
        // to create User
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            email,
            password: hashedPassword

        });
        // to generate token
        const token = generateToken(newUser._id, newUser.role);
        return successResponse(
            res,
            STATUS.OK,
            {
                _id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                token,
            },
            MESSAGES.USER_REGISTERED
        )

    }
    catch (error) {
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
            return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS)
        }
        // to check password
        const isVerify = await bcrypt.compare(password, user.password);
        if (!isVerify) {
            return errorResponse(res, STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS)
        }

        if (user.status !== "active") {
            return errorResponse(res, STATUS.FORBIDDEN, MESSAGES.ACCOUNT_INACTIVE);
        }

        // use utility to generate token
        const token = generateToken(user._id, user.role)

        return successResponse(
            res,
            STATUS.OK,
            {
                _id: user._id,
                email: user.email,
                role: user.role,
                token,
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
        const users = await userModel.find()
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
// @route   PUT/api/users/update/:id
// @access Admin/User
export const updateUser =async (req, res) => {
try{
    const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.INVALID_USER_ID);
        }
        // to update user by id
        const user = await userModel.findByIdAndUpdate(
            id,
            req.body, 
             { new: true }
        )
        if (!user) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { user },
            MESSAGES.USER.USER_UPDATED
        )
    }

catch(error)
{
  return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
}
}

// @desc  delete user
// @route   DELETE/api/users/delete/:id
// @access Admin/User
export const deleteUser = async (req, res) => {
  try
  {
    const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.USER.INVALID_USER_ID);
        }
        // to delete
        const user= await userModel.findByIdAndDelete(id)
        if (!user) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.USER.USER_NOT_FOUND);
        }
          return successResponse(
            res,
            STATUS.OK,
            { user },
            MESSAGES.USER.USER_DELETED
        )
  }
  catch(error)
  {
    return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
  }
}

// @desc Change user active/inactive status
// @route    PATCH /api/users/status/:id
// @access Admin
export const changeUserStatus = (req, res) => {

}

// @desc    Change user password
// @route   PATCH /api/users/password/:id
// @access Admin/User
export const changeUserPassword = (req, res) => {

}

// @desc    Get current logged-in user profile
// @route   GET /api/users/me
// @access Admin/User
export const getCurrentUser = (req, res) => {

}