import express from "express";


const PatientRouter=express.Router()

PatientRouter.get('/',getPatients)


export default PatientRouter