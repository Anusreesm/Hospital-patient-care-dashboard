import express from "express";


const AppointmentRouter = express.Router()

AppointmentRouter.get('/', getAppointments)


export default AppointmentRouter