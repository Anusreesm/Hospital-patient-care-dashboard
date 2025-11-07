import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import { errorResponse } from "../constants/response.js";
import regModel from "../models/Registration.js";

export const validateAddReg = (req, res, next) => {
   try {
      const { user_id, patient_id, medical_condition } = req.body;

      if (!user_id || !patient_id || !medical_condition) {
         return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PATIENT.REQUIRED_FIELDS);
      }
      next();
   }
   catch (err) {
      return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
   }
}
export const validateRegById = (req, res, next) => {
   try {
      const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.REGISTRATION.INVALID_REG_ID);
      }
      next();
   }
   catch (err) {
      console.log(err, "err")
      return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
   }
}

export const validateUpdateReg = async(req, res, next) => {
   try {
      const { id } = req.params
       const { medical_condition, allergies } = req.body;
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.REGISTRATION.INVALID_REG_ID);
      }
      // Find regDetails record first
          const regDetails = await regModel.findById(id);
          if (!regDetails) {
              return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.REGISTRATION.REG_NOT_FOUND);
          }
          const updateRegDetails = {};
           if (medical_condition) updateRegDetails.medical_condition = medical_condition
           if (allergies) updateRegDetails.allergies = allergies;
           // Check if at least one field is provided
    if (Object.keys(updateRegDetails).length === 0) {
        return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.REQUIRED_FIELDS);
    }
    //Pass the update object to the controller
    req.updateRegDetails = updateRegDetails;
      next();
   }
   catch (error) {
      console.log(error)
      return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
   }
}

export const validateDeleteReg= async(req,res,next)=>{
   try
   {
       const { id } = req.params
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.REGISTRATION.INVALID_REG_ID);
      }
      next();
   }
   catch(error)
   {
      console.log(error)
      return errorResponse(res,STATUS.INTERNAL_SERVER_ERROR,MESSAGES.SERVICE_ERROR)
   }
}