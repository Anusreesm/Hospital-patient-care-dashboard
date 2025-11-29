import mongoose from "mongoose";
import { errorResponse, successResponse } from "../constants/response.js";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import bloodBankReqModel from "../models/BloodBankRequest.js";
import { getBloodReqByIdQuery, getBloodReqQuery } from "../services/bloodBankReqService.js";
import appointmentModel from "../models/Appointment.js"
import bloodBankModel from "../models/BloodBankMaster.js";


// @route   GET /api/bloodBankReq/confirmed-appointments
// @desc    load confirmed appointments for dropdown
// @access staff/admin

export const getConfirmedAppointments = async (req, res) => {
    try {
        const confirmedAppointments = await appointmentModel
            .find({ status: "confirmed" })
            .populate("patient_id", "_id name bloodType age gender user_id")
            .populate("hosp_staff_id", "name")
            .populate("specialization_id", "spec_name");

        return successResponse(
            res,
            STATUS.OK,
            { confirmedAppointments },
            "Confirmed Appointments Loaded"
        );
    }
    catch (error) {
        console.error("get confirmed appointments:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}




// @route   POST /api/bloodBankReq/create
// @desc    Create new blood bank Req
// @access staff/admin
export const createBloodBankReq = async (req, res) => {
    try {
        const { user_id, appointment_id, units_required, status, priority } = req.body
        const request_date = new Date();
        const appointment = await appointmentModel.findById(appointment_id);
        if (!appointment) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.APPOINTMENT.APPOINTMENT_NOT_FOUND);
        }
        // Only allow requests for  CONFIRMED appointments
        const validStatuses = ["confirmed"];
        if (!validStatuses.includes(appointment.status)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK_REQ.CANNOT_CREATE);
        }

        // Check for duplicate request
        const existingReq = await bloodBankReqModel.findOne({ appointment_id });
        if (existingReq) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_EXISTS);
        }
        const bloodBankReq = await bloodBankReqModel.create({
            user_id,
            appointment_id,
            request_date,
            units_required,
            status,
            priority,
            fulfilled_date: null,  // always null on creation
            reason: null           // always null on creation
        });
        return successResponse(
            res,
            STATUS.OK,
            {
                bloodBankReq,
            },
            MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_CREATED
        )
    }
    catch (error) {
        console.error("Create BloodBankReq Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET /api/bloodBankReq
// @desc    Get all blood bank Req
// @access staff/admin
export const getBloodBankReq = async (req, res) => {
    try {
        let bloodBankReq = await getBloodReqQuery()
        bloodBankReq = bloodBankReq.filter(req => req.appointment_id);

        // Sort by priority
        const priorityMap = { emergency: 4, high: 3, medium: 2, low: 1 };
        bloodBankReq.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
        return successResponse(
            res,
            STATUS.OK,
            {
                bloodBankReq
            },
            MESSAGES.BLOODBANK_REQ.BLOODBANK_REQS_FETCHED
        )
    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET /api/bloodBankReq/:id
// @desc    Get single blood bank Req
// @access staff/admin
export const getBloodBankReqById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK_REQ.INVALID_BLOODBANK_REQ_ID);
        }
        // to get single bloodBankReq  by id
        const blood_BankReq = await getBloodReqByIdQuery(id)
        if (!blood_BankReq) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { blood_BankReq },
            MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   PUT /api/bloodBankReq/update/:id
// @desc    Update blood bank Req
// @access staff/admin
export const updateBloodBankReq = async (req, res) => {
    try {
        const { id } = req.params;
      
        const { status, priority, reason, units_required, request_date } = req.body;

        // Check if the request exists
        // const existingReq = await bloodBankReqModel.findById(id);
        const existingReq = await bloodBankReqModel
            .findById(id)
            .populate({
                path: "appointment_id",
                populate: { path: "patient_id", select: "bloodType" }
            });

        if (!existingReq) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_NOT_FOUND);
        }

        const bloodType = existingReq.appointment_id?.patient_id?.bloodType;
        const unitsNeeded = existingReq.units_required;

        // Prepare update fields
        const updateData = {};
        // -----------------------------
        //  HANDLE STATUS CHANGE
        // -----------------------------
        if (status) {
            updateData.status = status;

            if (status === "approved" || status === "rejected") {
                updateData.fulfilled_date = Date.now();
            } else {
                updateData.fulfilled_date = null;
            }
        }

        // -----------------------------
        //  APPROVE → DEDUCT STOCK
        // -----------------------------
        if (
            status === "approved" &&
            existingReq.status !== "approved" && // only if previously not approved
            existingReq.wasStockDeducted !== true // avoid double deduction
        ) {
            if (!bloodType || !unitsNeeded) {
                return errorResponse(res, STATUS.BAD_REQUEST, "Patient blood type missing");
            }

            const master = await bloodBankModel.findOne({ blood_type: bloodType });

            if (!master || master.available_unit < unitsNeeded) {
                // Auto reject due to insufficient units
                await bloodBankReqModel.findByIdAndUpdate(
                    id,
                    {
                        $set: {
                            status: "rejected",
                            reason: "Insufficient blood units available",
                            fulfilled_date: Date.now(),
                            wasStockDeducted: false
                        }
                    }
                );

                return errorResponse(
                    res,
                    STATUS.BAD_REQUEST,
                    MESSAGES.BLOODBANK_REQ.INSUFFICIENT_BLOOD_UNITS
                );
            }

            // Deduct stock
            master.available_unit -= unitsNeeded;
            await master.save();

            updateData.wasStockDeducted = true;
        }

        // -----------------------------
        //  REJECT → NO STOCK ADJUSTMENT
        // -----------------------------
        if (status === "rejected") {
            updateData.wasStockDeducted = false;
        }

        // Priority & Reason update
        if (priority) updateData.priority = priority;
        if (reason) updateData.reason = reason;
          if (units_required !== undefined) {
            updateData.units_required = units_required;
        }
        if (request_date) updateData.request_date = request_date;

        // -----------------------------
        //  APPLY UPDATE
        // -----------------------------
        const updatedReq = await bloodBankReqModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true,omitUndefined: true, context: "query" }
        );

        return successResponse(
            res,
            STATUS.OK,
            updatedReq,
            MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_UPDATED
        );

    } catch (error) {
        console.error("Update BloodBankReq Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
    }
};


// @route   DELETE /api/bloodBankReq/delete/:id
// @desc    Delete blood bank Req
// @access staff/admin
export const deleteBloodBankReq = async (req, res) => {

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.BLOODBANK_REQ.INVALID_BLOODBANK_REQ_ID);
        }

        // Fetch request before deleting
        const existingReq = await bloodBankReqModel
            .findById(id)
            .populate({
                path: "appointment_id",
                populate: { path: "patient_id", select: "bloodType" }
            });

        if (!existingReq) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_NOT_FOUND);
        }

        // -----------------------------------------
        //  ADD STOCK BACK ONLY IF DEDUCTED BEFORE
        // -----------------------------------------
        if (existingReq.status === "approved" && existingReq.wasStockDeducted === true) {
            const bloodType = existingReq.appointment_id?.patient_id?.bloodType;
            const unitsNeeded = existingReq.units_required;

            if (bloodType && unitsNeeded) {
                const master = await bloodBankModel.findOne({ blood_type: bloodType });

                if (master) {
                    master.available_unit += unitsNeeded;  // Add units back
                    await master.save();
                }
            }
        }

        // -----------------------------------------
        //  DELETE REQUEST
        // -----------------------------------------
        await bloodBankReqModel.findByIdAndDelete(id);

        return successResponse(
            res,
            STATUS.OK,
            { deletedId: id },
            MESSAGES.BLOODBANK_REQ.BLOODBANK_REQ_DELETED
        );

    } catch (error) {
        console.error("Delete BloodBankReq Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
    }
}
