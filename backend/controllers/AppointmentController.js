import mongoose from "mongoose"
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"
import { errorResponse, successResponse } from "../constants/response.js"
import appointmentModel from "../models/Appointment.js"
import regModel from "../models/Registration.js"
import userModel from "../models/User.js"
import { getAppointmentsByIdQuery, getAppointmentsQuery, populateAppointment } from "../services/appointmentService.js"
import createPatientToken from "../utils/createPatientToken.js"
import SendMail from "../utils/emails/sendMail.js"

import EmailTempForPatToken from "../utils/emails/templates/emailTemplateForPatientToken.js"
import sendTextToken from "../utils/SMS/sendTextWhatsapp.js"


// @route   POST/api/appointment/create
// @desc    add Appointment 
// @access admin/staff
export const addAppointment = async (req, res) => {
    try {
        let { payment_id,
            reg_id,
            patient_id,
            user_id,
            hosp_staff_id,
            specialization_id,
            date,
            time,
            description,
            status = "scheduled",
            amount
        } = req.body
        // get last appointment
        const lastAppointment = await appointmentModel.findOne().sort({ createdAt: -1 });
        // Generate new token number
        const token_no = await createPatientToken(lastAppointment);
        // new appointment   
        const appointment = await appointmentModel.create({
            payment_id,
            reg_id,
            patient_id,
            user_id,
            hosp_staff_id,
            specialization_id,
            date,
            time,
            description,
            token_no,
            status,
            amount
        });
        // populate
        await populateAppointment(appointment);
        //  Get patient's email via their user_id
        let toEmail = null;
        if (appointment.patient_id?.user_id) {
            const patientUser = await userModel
                .findById(appointment.patient_id.user_id)
                .select("email role");
            if (patientUser?.role === "patient") {
                toEmail = patientUser.email;
            }
        }

        //  Send Email (if found)
        if (toEmail) {
            const patientToken = appointment.token_no;
            const emailContent = EmailTempForPatToken({ toEmail, patientToken });
            await SendMail(toEmail, emailContent);
            console.log(" Email sent to:", toEmail);
        }

        // Send WhatsApp Message (if phone number exists)
        if (appointment.patient_id?.phone) {
            const phoneNumber = appointment.patient_id.phone;
            const name = appointment.patient_id?.name;
            await sendTextToken(phoneNumber, name, appointment.token_no, appointment.date, appointment.time);
        }
        return successResponse(
            res,
            STATUS.CREATED,
            {
                _id: appointment._id,
                payment: appointment.payment_id,
                registration: appointment.reg_id,
                patient: appointment.patient_id,
                user: appointment.user_id,
                staff: appointment.hosp_staff_id,
                specialization: appointment.specialization_id,
                date: appointment.date,
                time: appointment.time,
                description: appointment.description,
                token_no: appointment.token_no,
                status: appointment.status,
                amount: appointment.amount

            },
            MESSAGES.APPOINTMENT.APPOINTMENT_CREATED
        )

    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/appointment/
// @desc   GET all Appointment 
// @access admin/staff
export const getAllAppointment = async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0); // Midnight today

        // Auto-update: mark past 'scheduled' appointments as 'missed'
        await appointmentModel.updateMany(
            { date: { $lt: startOfToday }, status: "scheduled" },
            { $set: { status: "missed" } }
        );
        const appointments = await getAppointmentsQuery()
        return successResponse(
            res,
            STATUS.OK,
            {
                appointments
            },
            MESSAGES.APPOINTMENT.APPOINTMENTS_FETCHED
        )
    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/appointment/:id
// @desc   GET single   by id
// @access admin/staff
export const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params
        const appointment = await getAppointmentsByIdQuery(id)
        if (!appointment) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.APPOINTMENT.APPOINTMENT_NOT_FOUND);
        }
        return successResponse(
            res,
            STATUS.OK,
            { appointment },
            MESSAGES.APPOINTMENT.APPOINTMENT_FETCHED
        )
    }
    catch (error) {
        console.log("error:", error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}


// @route   PUT/api/appointment/update/:id
// @desc   update Appointment 
// @access admin/staff
export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateAppointments = req.updateAppointments;
        // Update patient
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            id,
            { $set: updateAppointments },
            { new: true }
        );
        if (!updatedAppointment) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.APPOINTMENT.APPOINTMENT_NOT_FOUND);
        }
        if (updateAppointments.status === "completed") {
            await regModel.findByIdAndUpdate(
                updatedAppointment.reg_id,
                { $set: { status: "discharged", discharge_date: new Date() } },
                { new: true }
            );
        }
        return successResponse(
            res,
            STATUS.OK,
            { appointment: updatedAppointment },
            MESSAGES.APPOINTMENT.APPOINTMENT_UPDATED
        );

    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   DELETE/api/appointment/delete/:id
// @desc   delete Appointment
// @access admin/staff
export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params
        // Validate appointment ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.INVALID_APPOINTMENT_ID);
        }


        const appointment = await appointmentModel.findById(id);
        if (!appointment) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.APPOINTMENT.APPOINTMENT_NOT_FOUND);
        }

        // Only allow deleting scheduled or confirmed ones
        if (!["scheduled", "confirmed", "cancelled", "missed"].includes(appointment.status)) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.APPOINTMENT.SCHEDULED_CONFIRMED_APPOINTMENT);
        }
        appointment.status = "cancelled";
        await appointment.save();

        return successResponse(
            res,
            STATUS.OK,
            { appointment },
            MESSAGES.APPOINTMENT.APPOINTMENT_DELETED
        );
    }
    catch (error) {
        console.log(error)
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

