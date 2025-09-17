import express from "express";


const BloodBankReqRouter = express.Router()

BloodBankReqRouter.get('/', getBloodBankReq)


export default BloodBankReqRouter