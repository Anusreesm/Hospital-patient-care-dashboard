import express from "express";
import bodyParser from "body-parser";
import { addPayment, deletePayment, getAllPayment, getPaymentById, paymentCancel, paymentSuccess, updatePayment } from "../controllers/paymentController.js";
import { authMiddleware, authorize } from "../middlewares/authorize.js";


const PaymentRouter = express.Router()
// @route   POST/api/payment/create
// @desc    add Payment 
PaymentRouter.post("/create",authMiddleware, addPayment)

// @route   GET/api/payment/success
// @desc   Success URL handler 
PaymentRouter.get('/success',authMiddleware,paymentSuccess)

// @route   GET/api/payment/cancel
// @desc    Cancel URL handler 
PaymentRouter.get('/cancel',authMiddleware,paymentCancel)

// @route   GET/api/payment/
// @desc   GET all Payment 
PaymentRouter.get("/", authMiddleware,getAllPayment)

// @route   GET/api/payment/:id
// @desc   GET single   by id
PaymentRouter.get("/:id",authMiddleware, getPaymentById)

// @route   PUT/api/payment/update/:id
// @desc   update Payment 
PaymentRouter.put("/update/:id",authMiddleware,authorize("admin"), updatePayment)

// @route   DELETE/api/payment/delete/:id
// @desc   delete payment
PaymentRouter.delete("/delete/:id",authMiddleware,authorize("admin"), deletePayment)






export default PaymentRouter