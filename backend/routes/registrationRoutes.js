import express from "express";


const RegistrationRouter = express.Router()

RegistrationRouter.get('/', getRegistration)


export default RegistrationRouter