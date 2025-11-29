import Stripe from "stripe"
import { errorResponse, successResponse } from "../constants/response.js";
import { MESSAGES } from "../constants/messages.js";
import { STATUS } from "../constants/httpStatus.js";
import paymentModel from "../models/Payment.js";
import appointmentModel from "../models/Appointment.js";



const stripe = new Stripe(process.env.STRIPE_SECRET)

// @route   POST/api/payment/create
// @desc    add Payment
// @access admin/users
export const addPayment = async (req, res) => {

    try {

        const {
            user_id,
            patient_id,
            hosp_staff_id,
            appointment_id,
            amount,
            payment_method,
            description
        } = req.body;
        if (!amount || amount <= 0) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PAYMENT.INVALID_AMT);
        }
        // Ensure appointment exists
        const appointment = await appointmentModel.findById(appointment_id);
        if (!appointment) {
            return errorResponse(res, STATUS.NOT_FOUND, "Appointment not found");
        }

        // Create pending payment if not exists
        let payment = await paymentModel.findOne({ appointment_id });
        if (!payment) {
            payment = await paymentModel.create({
                user_id,
                patient_id,
                hosp_staff_id,
                appointment_id,
                amount,
                payment_method: payment_method || "card",
                description: description || "Appointment Payment",
                status: "pending",
            });
        }




        // CHECKOUT SESSION
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: description || `Payment for ${patient_id || "patient"}`
                        },

                        unit_amount: Math.round(amount * 100),

                    },
                    // dynamically
                    quantity: 1,
                }
            ],
           

            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel?payment_id=${payment._id}`,



            metadata: {
                payment_id: payment._id.toString(),
                appointment_id: appointment._id.toString(),
            },
        });

        return successResponse(
            res,
            STATUS.OK,
            { id: session.id, url: session.url },
            MESSAGES.PAYMENT.PAYMENT_CREATED
        )
    }
    catch (error) {
        console.error("Stripe create session error:", error);

        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}
// @route   GET/api/payment/success
// @desc   Success URL handler 
// @access admin/users
export const paymentSuccess = async (req, res) => {
    try {
        const { session_id } = req.query;

        const session = await stripe.checkout.sessions.retrieve(session_id);
        const { payment_id, appointment_id } = session.metadata;

        // update payment
        const payment = await paymentModel.findById(payment_id);
        if (!payment) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PAYMENT.INVALID_PAYMENT_ID)
        }

        payment.status = "paid";
        payment.transactionId = session.id;
        payment.amount = session.amount_total / 100;
        await payment.save();

        // update appointment
        const appointment = await appointmentModel.findById(appointment_id);
        if (appointment) {
            appointment.status = "confirmed";
            await appointment.save();
        }
        return successResponse(
            res,
            STATUS.OK,
            MESSAGES.PAYMENT.PAYMENT_APPOINTMENT_CONFIRM
        )

    } catch (error) {
        console.error(" Error in payment success:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
};
// @route   GET/api/payment/cancel
// @desc    Cancel URL handler 
// @access admin/users

export const paymentCancel = async (req, res) => {
    try {
        const { payment_id } = req.query;
        if (!payment_id) {
            return errorResponse(res, STATUS.BAD_REQUEST, MESSAGES.PAYMENT.PAYMENT_ID_REQUIRED);
        }
        const payment = await paymentModel.findById(payment_id);
        if (payment) {
            payment.status = "failed";
            await payment.save();
        } else {
            return errorResponse(res, STATUS.NOT_FOUND, MESSAGES.PAYMENT.PAYMENT_NOT_FOUND);
        }
        return successResponse(res, STATUS.OK, {}, MESSAGES.PAYMENT.PAYMENT_CANCELLED_FAILED)

    } catch (error) {
        console.error(" Error in payment cancel:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
};


// @route   GET/api/payment/
// @desc   GET all Payment 
// @access admin/users
export const getAllPayment = async (req, res) => {
    try {
        const payment = await paymentModel.find()
        return successResponse(
            res,
            STATUS.OK,
            {
                payment
            },
            MESSAGES.PAYMENT.PAYMENTS_FETCHED
        )
    }
    catch (error) {
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}
// @route   GET/api/payment/:id
// @desc   GET single   by id
// @access admin/users
export const getPaymentById = () => {
    try {

    }
    catch (error) {

    }
}

// @route   PUT/api/payment/update/:id
// @desc   update Payment 
// @access admin/users
export const updatePayment = () => {
    try {

    }
    catch (error) {

    }
}

// @route   DELETE/api/payment/delete/:id
// @desc   delete payment
// @access admin/users
export const deletePayment = () => {
    try {

    }
    catch (error) {

    }
}

