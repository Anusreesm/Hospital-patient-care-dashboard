import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"
import { errorResponse } from "../constants/response.js"


// @route   POST/api/chat/create
// @desc    add Chat 
// @access public
export const addChat=async(req,res)=>{
    try{

    }
    catch(error)
    {
        console.log(error)
        return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/chat/
// @desc   GET all Chat 
// @access public
export const getAllChat=async(req,res)=>{
    try{

    }
    catch(error)
    {
        console.log(error)
        return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/chat/:id
// @desc   GET single   by id
// @access public
export const getChatById=async(req,res)=>{
    try{

    }
    catch(error)
    {
        console.log(error)
        return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
    }
}

// @route   PUT/api/chat/update/:id
// @desc   update Chat 
// @access public
export const updateChat=async(req,res)=>{
    try{

    }
    catch(error)
    {
        console.log(error)
        return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
    }
}

// @route   DELETE/api/chat/delete/:id
// @desc   delete Chat
// @access public
export const deleteChat=async(req,res)=>{
    try{

    }
    catch(error)
    {
        console.log(error)
        return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
    }
}

