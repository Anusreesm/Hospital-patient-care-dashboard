
import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js";
import deptModel from "../models/DepartmentMaster.js";

// @desc    create new dept
// @route   POST/api/deptMaster/create
// @access Admin/staff 
export const createDept = async (req, res) => {
    try {
        const { dept_name } = req.body
        if (!dept_name || !dept_name.trim()) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.DEPARTMENT.DEPT_NAME_REQUIRED);
        }
        //  to check if department already exist
        const existing_Dept = await deptModel.findOne({ dept_name: { $regex: `^${dept_name.trim()}$`, $options: "i" } });
        if (existing_Dept) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.DEPARTMENT.DEPT_EXISTS);
        }
        // to create department
        const newDept = await deptModel.create({
            dept_name
        });
        return successResponse(
            res,
            STATUS.OK,
            {
                _id: newDept._id,
                dept_name: newDept.dept_name,
            },
            MESSAGES.DEPARTMENT.DEPT_CREATED
        )
    }
    catch (error) {
        console.error("create dept Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @desc get all dept
// @route POST/api/deptMaster/
// @access Admin/staff 
export const getDept = async (req, res) => {
    try {
        // To find All dept
        const dept = await deptModel.find()
        return successResponse(
            res,
            STATUS.OK,
            {
                dept
            },
            MESSAGES.DEPARTMENT.DEPTS_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @desc GET single Department
// @route GET/api/deptMaster/:id
// @access Admin/staff
export const getDeptById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.DEPARTMENT.INVALID_DEPT_ID);
        }
        // to get single dept  by id
        const dept = await deptModel.findById(id)
        if (!dept) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.DEPARTMENT.DEPT_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { dept },
            MESSAGES.DEPARTMENT.DEPT_FETCHED
        )
    }
    catch (error) {
        // console.log("department error:", error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }

}

// @desc update Department
// @route PUT/api/deptMaster/update/:id
// @access Admin/Staff
export const updateDept = async (req, res) => {
    try {
        const { id } = req.params
        const { dept_name } = req.body;
          // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.DEPARTMENT.INVALID_DEPT_ID);
        }
        // Check if dept_name is provided
        if (!dept_name || !dept_name.trim()) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.DEPARTMENT.DEPT_NAME_REQUIRED);
        }
        
       // Check if department exists
        const dept = await deptModel.findById(id);
        if (!dept) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.DEPARTMENT.DEPT_NOT_FOUND);
        }
      // Case-insensitive duplicate check (excluding current department)
        const existing_Dept = await deptModel.findOne({
            dept_name: { $regex: `^${dept_name.trim()}$`, $options: "i" },
            _id: { $ne: id } // exclude current dept-ignore the current department when checking for duplicates.
        });
        if (existing_Dept) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.DEPARTMENT.DEPT_EXISTS);
        }

        // Update department
        dept.dept_name = dept_name.trim();
        const updatedDept = await dept.save();

        return successResponse(
            res,
            STATUS.OK,
            { dept: updatedDept },
            MESSAGES.DEPARTMENT.DEPT_UPDATED
        );
    }
    catch (error) {
       return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}


// @desc  delete department
// @route   DELETE/api/deptMaster/delete/:id
// @access Admin/staff
export const deleteDept = async(req, res) => {
try{
 const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.DEPARTMENT.INVALID_DEPT_ID);
        }
        // to delete
        const dept = await deptModel.findByIdAndDelete(id)
        if (!dept) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.DEPARTMENT.DEPT_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { dept },
            MESSAGES.DEPARTMENT.DEPT_DELETED
        )
}
catch(error)
{
    return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
}
}

