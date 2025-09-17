import express from "express";


const BloodBankRouter = express.Router()

BloodBankRouter.get('/', getBloodBank)


export default BloodBankRouter