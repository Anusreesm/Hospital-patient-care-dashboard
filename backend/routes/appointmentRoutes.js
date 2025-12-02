import express from "express";
import { addAppointment, deleteAppointment, getAllAppointment, getAppointmentById, updateAppointment } from "../controllers/AppointmentController.js";
import { validateAddAppointment, validateGetAppointmentById, validateUpdateAppointment } from "../validators/appointmentValidators.js";
import { authMiddleware, authorize } from "../middlewares/authorize.js";


const AppointmentRouter = express.Router()

// @route   POST/api/appointment/create
// @desc    add Appointment 
AppointmentRouter.post("/create",authMiddleware,authorize("admin","patient","staff"), validateAddAppointment, addAppointment)


// @route   GET/api/appointment/
// @desc   GET all Appointment 
AppointmentRouter.get("/",authMiddleware, getAllAppointment)

// @route   GET/api/appointment/:id
// @desc   GET single   by id
AppointmentRouter.get("/:id",authMiddleware, validateGetAppointmentById, getAppointmentById)

// @route   PUT/api/appointment/update/:id
// @desc   update Appointment 
AppointmentRouter.put("/update/:id",authMiddleware,validateUpdateAppointment, updateAppointment)

// @route   DELETE/api/appointment/delete/:id
// @desc   delete Appointment
AppointmentRouter.delete("/delete/:id",authMiddleware, deleteAppointment)




export default AppointmentRouter