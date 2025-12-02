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
import paymentModel from "../models/Payment.js"


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

        //  Create a pending payment entry
        const pendingPayment = await paymentModel.create({
            user_id,
            patient_id,
            hosp_staff_id,
            amount,
            payment_method: "card",
            description: description || "Appointment payment",
            status: "pending",
        });



        // get last appointment
        const lastAppointment = await appointmentModel.findOne().sort({ createdAt: -1 });
        // Generate new token number
        const token_no = await createPatientToken(lastAppointment);


        const registration = await regModel.findOne({
            patient_id,
            discharge_date: null,
            status: { $nin: ["deleted", "discharged"] }
        }).sort({ registration_date: -1 });

        if (!registration) {
            return errorResponse(res, STATUS.BAD_REQUEST, "No active registration found for this patient");
        }



        // new appointment   
        const appointment = await appointmentModel.create({
            payment_id: pendingPayment._id,
            reg_id: registration._id,
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
        pendingPayment.appointment_id = appointment._id;
        await pendingPayment.save();
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
        // await appointmentModel.updateMany(
        //     { date: { $lt: startOfToday }, status: "scheduled" },
        //     { $set: { status: "missed" } }
        // );
        const outdatedAppointments = await appointmentModel.find({
            date: { $lt: startOfToday },
            status: "scheduled",
        });

        // Update appointment status to missed
        await appointmentModel.updateMany(
            { date: { $lt: startOfToday }, status: "scheduled" },
            { $set: { status: "missed" } }
        );

        // Update payment status to failed for each missed appointment
        const missedAppointmentIds = outdatedAppointments.map(a => a._id);
        console.log(missedAppointmentIds[0], "missed")

        if (missedAppointmentIds.length > 0) {
            await paymentModel.updateMany(
                { appointment_id: { $in: missedAppointmentIds }, status: "pending" },
                { $set: { status: "failed" } }
            );
        }

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


        // Fetch current appointment first
        const currentAppointment = await appointmentModel.findById(id);
        if (!currentAppointment) {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.APPOINTMENT.APPOINTMENT_NOT_FOUND);
        }

        // console.log("Current appointment from DB:", currentAppointment);

        // Handle "Mark as Complete" logic
        if (updateAppointments.status === "completed") {

            // console.log("Attempting to mark complete...");
            // console.log("Current appointment status:", currentAppointment.status);

            // Step 1: Ensure current status is confirmed
            if (currentAppointment.status !== "confirmed") {
                return errorResponse(
                    res,
                    STATUS.BAD_REQUEST,
                    "Appointment must be confirmed before marking complete"
                );
            }

            // Step 2: Check payment
            const payment = await paymentModel.findOne({ appointment_id: currentAppointment._id });
            // console.log("Payment found:", payment);

            if (!payment || payment.status !== "paid") {
                return errorResponse(
                    res,
                    STATUS.BAD_REQUEST,
                    "Cannot mark complete until payment is paid"
                );
            }

            // Step 3: Update registration if exists
            if (currentAppointment.reg_id) {
                await regModel.findByIdAndUpdate(
                    currentAppointment.reg_id,
                    { $set: { status: "discharged", discharge_date: new Date() } },
                    { new: true }
                );
            }
        }


        // actual appointment update
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            id,
            { $set: updateAppointments },
            { new: true }
        );
        // console.log("updateAppointments:", updateAppointments)

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
        if (appointment.payment_id) {
            await paymentModel.findByIdAndUpdate(
                appointment.payment_id,
                { $set: { status: "deleted" } },
                { new: true }
            );
        }
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

