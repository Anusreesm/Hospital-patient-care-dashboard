import patientModel from "../models/Patient.js";
import regModel from "../models/Registration.js";

//  GET all patients

export const getPatientsQuery = () => {
  return patientModel.find({ isActive: true })
    .populate([
      {
        path: "addresses_id",
        select: "street city state country pincode"
       },
      // {
      //   path: "bloodBank_id",
      //   select: "blood_type"
      // },
      {
        path: "user_id",
        select: "role status email name"
      }
    ]);
};


// get all patient by id
export const getPatientsByIdQuery = (id) => {
  return patientModel.findById(id)
    .populate("addresses_id", "street city state country pincode")
    // .populate("bloodBank_id", "blood_type")
    .populate("user_id","role status email")

}

// get all registrations
export const getRegsQuery = () => {
  return regModel.find()
     .populate([
      {
        path: "user_id",
        select: "name role status email lastLoginAt",
      },
      {
        path: "patient_id",
        select: "created_by name phone age gender bloodType emergency_name emergency_contact",
        populate: [
          {
            path: "addresses_id",
            select: "street city state country pincode",
          },
        ],
      },
    ]);
};
     
// get registration by id
export const getRegByIdQuery = async (id) => {
  return await regModel
     .findById(id)
    .populate({
      path: "user_id",
      select: "name role status email lastLoginAt",
      options: { strictPopulate: false }
    })
    .populate({
      path: "patient_id",
      select: "created_by name phone age gender bloodType",
      populate: [
        {
          path: "addresses_id",
          select: "street city state country pincode",
        },
        // {
        //   path: "bloodBank_id",
        //   select: "blood_type",
        // },
      ],
       options: { strictPopulate: false }, //  Important: prevents errors if ref missing
    })
      .lean(); //makes it return plain JS object with null patient_id if missing
};

