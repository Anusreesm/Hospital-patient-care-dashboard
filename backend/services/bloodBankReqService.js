import bloodBankReqModel from "../models/BloodBankRequest.js";

// get all bloodbank req
export const getBloodReqQuery = () => {
  return bloodBankReqModel.find()
    .populate([
      {
        path: "user_id",
        select: "name role status email ",
      },
      {
        path: "appointment_id",
        match: { status: "confirmed" },
        select: "token_no status date amount",
        populate: [
          {
            path: "patient_id",
            select: "name age bloodType gender",
          },
          {
            path: "hosp_staff_id",
            select: "name",
          },
          {
            path: "specialization_id",
            select: "spec_name"
          }
        ],
      },
    ])
};


// get all bloodbank req by id
// get all patient by id
export const getBloodReqByIdQuery = (id) => {
  return bloodBankReqModel.findById(id)
     .populate([
      {
        path: "user_id",
        select: "name role status email ",
      },
      {
        path: "appointment_id",
        match: { status: "confirmed" },
        select: "token_no status date amount",
        populate: [
          {
            path: "patient_id",
            select: "name age bloodType gender",
          },
          {
            path: "hosp_staff_id",
            select: "name",
          },
          {
            path: "specialization_id",
            select: "spec_name"
          }
        ],
      },
    ])
   .lean(); 
};