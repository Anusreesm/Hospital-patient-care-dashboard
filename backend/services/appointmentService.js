import appointmentModel from "../models/Appointment.js";

export const populateAppointment = async (appointmentDoc) => {
  if (!appointmentDoc) return null;

  return appointmentDoc.populate([
    { path: "payment_id" },
    { path: "reg_id", select: "registration_date medical_condition status" },
    { path: "patient_id", select: "name age gender phone" },
    { path: "patient_id", populate: { path: "user_id", select: "email role" } },
    { path: "user_id", select: "name role" },
    { path: "hosp_staff_id", select: "name" },
    { path: "specialization_id", select: "spec_name" },
  ]);
};

export const getAppointmentsQuery=()=>{
  return appointmentModel.find()
  .populate([
      { path: "payment_id" },
      { path: "reg_id", select: "registration_date medical_condition status" },
      { 
        path: "patient_id", 
        select: "name age gender phone",
        populate: { path: "user_id", select: "email role" } 
      },
      { path: "user_id", select: "name role" },
      {
        path: "hosp_staff_id",
        select: "name user_id specialization_id",
        populate: { path: "user_id", select: "name email role" } 
      },
      { path: "specialization_id", select: "spec_name" },
    ]);
};

export const getAppointmentsByIdQuery = (id) => {
  return appointmentModel.findById(id)
  .populate([
    { path: "payment_id",select:"status transactionId" },
    { path: "reg_id", select: "registration_date medical_condition status" },
    { path: "patient_id", select: "name age gender phone" },
    { path: "patient_id", populate: { path: "user_id", select: "email role" } },
    { path: "user_id", select: "name role" },
    { path: "hosp_staff_id", select: "name" },
    { path: "specialization_id", select: "spec_name" },
  ]);
};