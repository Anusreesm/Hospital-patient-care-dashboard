
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js"
import regModel from "../models/Registration.js"
import { getRegByIdQuery, getRegsQuery } from "../services/patientService.js"

// @route   POST /api/registration/create
// @desc    Create new registration
//@access admin/staff
export const createReg = async (req, res) => {
    try {
        const { user_id, patient_id, discharge_date, medical_condition, allergies, status } = req.body
        const registration_date = Date.now()

        const registration = await regModel.create({
            user_id,
            patient_id,
            registration_date,
            discharge_date: null,
            medical_condition,
            allergies,
            status: "active"
        })
        return successResponse(
            res,
            STATUS.OK,
            {
                _id: registration._id,
                user_id: registration.user_id,
                patient_id: registration.patient_id,
                registration_date: registration.registration_date,
                discharge_date: registration.discharge_date,
                medical_condition: registration.medical_condition,
                allergies: registration.allergies,
                status: registration.status

            },
            MESSAGES.REGISTRATION.REG_CREATED
        )
    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }

}
// @route   GET /api/registration/
// @desc    Get all registrations
export const getAllReg = async (req, res) => {
    try {
        const reg = await getRegsQuery()
        return successResponse(
            res,
            STATUS.OK,
            {
                reg
            },
            MESSAGES.REGISTRATION.REGS_FETCHED
        )
    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}
// @route   GET /api/registration/:id
// @desc    Get a single registration by ID
export const getRegById = async (req, res) => {
    try {
        const { id } = req.params

        // Fetch registration details using query file
        const regDetails = await getRegByIdQuery(id)
        console.log("Fetched regDetails (raw):", regDetails);

        if (!regDetails) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.REGISTRATION.REG_NOT_FOUND)
        }


        return successResponse(
            res,
            STATUS.OK,
            { regDetails },
            MESSAGES.REGISTRATION.REG_FETCHED
        )

    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   PUT /api/registration/update/:id
// @desc    Update registration by ID
export const updateReg = async (req, res) => {
    try {
        const { id } = req.params
        const { updateRegDetails } = req;
        // Update patient
        const updatedReg = await regModel.findByIdAndUpdate(
            id,
            { $set: updateRegDetails },
            { new: true }
        );
        console.log(updateReg)

        if (!updatedReg) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.REGISTRATION.REG_NOT_FOUND);
        } return successResponse(
            res,
            STATUS.OK,
            { updatedReg },
            MESSAGES.REGISTRATION.REG_UPDATED
        );

    } catch (error) {
        console.error("Error updating reg:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   DELETE /api/registration/delete/:id
// @desc    Delete registration by ID
export const deleteReg = async(req, res) => {
    try {
        const { id } = req.params
     // Update all active or discharged registrations for the given patient
        const regDetails = await regModel.updateMany(
            { 
                  _id: id,
               status: "active"
            },
            { 
                $set: { status: "deleted" } 
            }
        );
         //  where no document was matched
        if (regDetails.matchedCount === 0) {
            return errorResponse(
                res,
                STATUS.NOT_FOUND,
                MESSAGES.REGISTRATION.REGISTRATION_NOT_FOUND
            );
        }
                   return successResponse(
                            res,
                            STATUS.OK,
                            { regDetails },
                            MESSAGES.REGISTRATION.REG_DELETED
                        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}
