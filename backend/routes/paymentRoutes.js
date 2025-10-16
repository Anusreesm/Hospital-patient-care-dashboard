import express from "express";
import { addPayment, deletePayment, getAllPayment, getPaymentById, updatePayment } from "../controllers/paymentController.js";


const PaymentRouter = express.Router()
// @route   POST/api/payment/create
// @desc    add Payment 
PaymentRouter.post("/create", addPayment)


// @route   GET/api/payment/
// @desc   GET all Payment 
PaymentRouter.get("/", getAllPayment)

// @route   GET/api/payment/:id
// @desc   GET single   by id
PaymentRouter.get("/:id", getPaymentById)

// @route   PUT/api/payment/update/:id
// @desc   update Payment 
PaymentRouter.put("/update/:id", updatePayment)

// @route   DELETE/api/payment/delete/:id
// @desc   delete payment
PaymentRouter.delete("/delete/:id", deletePayment)



export default PaymentRouter