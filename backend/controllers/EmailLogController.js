import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"
import { errorResponse } from "../constants/response.js"


// @route   POST/api/emailLog/create
// @desc    add EmailLog 
// @access public
export const addEmailLog=async(req,res)=>{
    try{

    }
    catch(error)
    {
        console.log(error)
        return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/emailLog/
// @desc   GET all EmailLog 
// @access public
export const getAllEmailLog=async(req,res)=>{
    try{

    }
    catch(error)
    {
        console.log(error)
        return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/emailLog/:id
// @desc   GET single emaillog   by id
// @access public
export const getEmailLogById=async(req,res)=>{
    try{

    }
    catch(error)
    {
        console.log(error)
        return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
    }
}

// @route   PUT/api/emailLog/update/:id
// @desc   update EmailLog 
// @access public
export const updateEmailLog=async(req,res)=>{
    try{

    }
    catch(error)
    {
        console.log(error)
        return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
    }
}

// @route   DELETE/api/emailLog/delete/:id
// @desc   delete EmailLog
// @access public
export const deleteEmailLog=async(req,res)=>{
    try{

    }
    catch(error)
    {
        console.log(error)
        return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
    }
}

