import patientModel from "../models/Patient.js";

//  GET all patients

export const getPatientsQuery = () => {
  return patientModel.find()
    .populate([
      {
        path: "addresses_id",
        select: "street city state country pincode"
      },
      {
        path: "bloodBank_id",
        select: "blood_type"
      },
      {
        path: "user_id",
        select: "role status email"
      }
    ]);
};


// get all patient by id
export const getPatientsByIdQuery = (id) => {
  return patientModel.findById(id)
    .populate("addresses_id", "street city state country pincode")
    .populate("bloodBank_id", "blood_type")
    .populate("user_id","role status email")

}

// get all registrations
