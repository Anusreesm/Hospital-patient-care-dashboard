import express from "express";
import { addAppointment, deleteAppointment, getAllAppointment, getAppointmentById, updateAppointment } from "../controllers/AppointmentController.js";
import { validateAddAppointment, validateGetAppointmentById, validateUpdateAppointment } from "../validators/appointmentValidators.js";


const AppointmentRouter = express.Router()

// @route   POST/api/appointment/create
// @desc    add Appointment 
AppointmentRouter.post("/create",validateAddAppointment, addAppointment)


// @route   GET/api/appointment/
// @desc   GET all Appointment 
AppointmentRouter.get("/", getAllAppointment)

// @route   GET/api/appointment/:id
// @desc   GET single   by id
AppointmentRouter.get("/:id",validateGetAppointmentById, getAppointmentById)

// @route   PUT/api/appointment/update/:id
// @desc   update Appointment 
AppointmentRouter.put("/update/:id",validateUpdateAppointment, updateAppointment)

// @route   DELETE/api/appointment/delete/:id
// @desc   delete Appointment
AppointmentRouter.delete("/delete/:id", deleteAppointment)




export default AppointmentRouter