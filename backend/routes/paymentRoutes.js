import express from "express";


const PaymentRouter = express.Router()

PaymentRouter.get('/', getPayment)


export default PaymentRouter