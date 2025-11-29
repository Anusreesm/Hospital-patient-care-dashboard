import mongoose from "mongoose";
import { STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import { errorResponse } from "../constants/response.js";
import appointmentModel from "../models/Appointment.js";

// to add appointment
export const validateAddAppointment = async (req, res, next) => {

    try {
        let {
            reg_id,
            patient_id,

            hosp_staff_id,
            specialization_id,
            date,
            time,
            amount
        } = req.body
        console.log("Incoming req.body =>", req.body);

        if (!patient_id || !hosp_staff_id || !specialization_id || !date || !time || !amount) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.REQUIRED_FIELDS);
        }
        const allIds = [
            // { field: "reg_id", value: reg_id },
            { field: "patient_id", value: patient_id },
            { field: "hosp_staff_id", value: hosp_staff_id },
            { field: "specialization_id", value: specialization_id },
        ];
        for (const idObj of allIds) {
            if (!mongoose.Types.ObjectId.isValid(idObj.value)) {
                return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.INVALID_ID);
            }
        }

        //  duplicate appointment for the same registration
        if (reg_id) {
            const existingAppointment = await appointmentModel.findOne({
                reg_id,
                status: { $in: ["scheduled", "confirmed"] },
            });
            if (existingAppointment) {
                return errorResponse(res, STATUS.CONFLICT, MESSAGES.APPOINTMENT.ALREADY_EXIST);
            }
        }


        // Validate date and time
        const appointmentDateTime = new Date(`${date}T${time}`);
        if (isNaN(appointmentDateTime)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.INVALID_DATE_TIME);
        }

        if (appointmentDateTime < new Date()) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.CANNOT_SCHEDULE_PAST);
        }

        // Check time format (schema already enforces HH:mm)
        const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(time)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.TIME_FORMAT);
        }

        //  Prevent doctor/staff double booking
        const staffBooked = await appointmentModel.findOne({
            hosp_staff_id,
            date,
            time,
        });
        if (staffBooked) {
            return errorResponse(res, STATUS.CONFLICT, MESSAGES.APPOINTMENT.STAFF_ALREADY_APPOINTMENT);
        }


        const patientAlreadyBooked = await appointmentModel.findOne({
            patient_id,
            date,
            status: { $in: ["scheduled", "confirmed"] },
        });

        if (patientAlreadyBooked) {
            return errorResponse(
                res,
                STATUS.CONFLICT,
                MESSAGES.APPOINTMENT.ALREADY_APPOINTMENT
            );
        }

            if (amount === undefined || amount === null) {
                return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.AMOUNT_REQUIRED);
            }

            // Check valid number
            if (isNaN(amount) || Number(amount) < 0) {
                return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.INVALID_AMT);
            }

            next();
        }
    catch (error) {
            return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
        }
    }

//  to get Appointment by id
export const validateGetAppointmentById = (req, res, next) => {
        try {
            const { id } = req.params
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.INVALID_APPOINTMENT_ID);
            }
            next();
        }
        catch (error) {
            return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR);
        }
    }

    // to update appointment
    export const validateUpdateAppointment = async (req, res, next) => {
        try {
            const { id } = req.params
            let {
                hosp_staff_id,
                specialization_id,
                date,
                time,
                description,
                status,
                amount
            } = req.body
            // Validate appointment ID format
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.INVALID_APPOINTMENT_ID);
            }
            // Check if appointment exists
            const appointment = await appointmentModel.findById(id)
            if (!appointment) {
                return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.APPOINTMENT.APPOINTMENT_NOT_FOUND);
            }
            // Validate all possible ObjectIds dynamically
            const allIds = [
                { field: "hosp_staff_id", value: hosp_staff_id },
                { field: "specialization_id", value: specialization_id },
            ];
            for (const idObj of allIds) {
                if (idObj.value && !mongoose.Types.ObjectId.isValid(idObj.value)) {
                    return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.COMMON.INVALID_ID);
                }
            }
            // Build update object
            const updateAppointments = {};
            if (hosp_staff_id) updateAppointments.hosp_staff_id = hosp_staff_id;
            if (specialization_id) updateAppointments.specialization_id = specialization_id;



            if (date !== undefined && date !== null && date !== "") {
                const isoDate = new Date(date);
                if (isNaN(isoDate.getTime())) {
                    return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.INVALID_DATE_TIME);
                }
                updateAppointments.date = isoDate;
            }

            if (time !== undefined && time !== null && time !== "") {
                const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
                if (!timeRegex.test(time)) {
                    return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.TIME_FORMAT);
                }
                updateAppointments.time = time;
            }
            if (description != undefined) updateAppointments.description = description;
            if (status != undefined) {
                const validStatuses = ["scheduled", "confirmed", "completed", "cancelled"];
                if (!validStatuses.includes(status)) {
                    return errorResponse(res, STATUS.BAD_REQUEST, "Invalid appointment status");
                }
                updateAppointments.status = status;
            }
            if (amount !== undefined) {
                if (isNaN(amount) || Number(amount) < 0) {
                    return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.INVALID_AMT);
                }
                updateAppointments.amount = Number(amount);
            }

            // Check if at least one field is provided
            // if (Object.keys(updateAppointments).length === 0) {
            //     return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.REQUIRED_FIELDS);
            // }
            // Pass the update object to the controller
            req.updateAppointments = updateAppointments;
            console.log(" updateAppointments:", updateAppointments);

            next();
        }
        catch (error) {
            return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
        }
    }
