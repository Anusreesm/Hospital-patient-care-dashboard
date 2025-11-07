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
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
            metadata: {
                user_id,
                patient_id,
                hosp_staff_id,
                appointment_id,
                payment_method,
            },
        });
        // Save payment info in MongoDB
        const newPayment = await paymentModel.create({
            user_id,
            patient_id,
            hosp_staff_id,
            appointment_id,
            amount,
            payment_method,
            description,
            status: "pending", // update to 'paid' after webhook confirmation
            transactionId: session.id, // store stripe session id
        });

        // Link this payment to appointment and update status to confirmed
        await appointmentModel.findByIdAndUpdate(appointment_id, {
            payment_id: newPayment._id,
            status: "confirmed",
        }, { new: true });
        return successResponse(
            res,
            STATUS.OK,
            { id: session.id, url: session.url },
            MESSAGES.PAYMENT.PAYMENT_CREATED
        )
    }
    catch (error) {
        console.error("Stripe Error:", error);
        return errorResponse(res, STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SERVICE_ERROR)
    }
}

// @route   GET/api/payment/
// @desc   GET all Payment 
// @access admin/users
export const getAllPayment = (req,res) => {
    try {
        return successResponse(
            "message"
        );
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