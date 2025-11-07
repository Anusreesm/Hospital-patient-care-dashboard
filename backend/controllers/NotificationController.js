
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"

// @route   POST/api/notification/create
// @desc    add Notification 
// @access public
export const createNotification = (req, res) => {
    try {

    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/notification/
// @desc   GET all Notification 
// @access public
export const getAllNotification = (req, res) => {
    try {

    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/notification/:id
// @desc   GET single  Notification by id
// @access public

export const getNotificationById = (req, res) => {
    try {

    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}
// @route   PUT/api/notification/update/:id
// @desc   update Notification 
// @access public
export const updateNotification = (req, res) => {
    try {

    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   DELETE/api/notification/delete/:id
// @desc   delete Notification
// @access public
export const deleteNotification = (req, res) => {
    try {

    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}
