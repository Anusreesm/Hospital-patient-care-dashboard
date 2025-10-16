import bloodBankReqModel from "../models/BloodBankRequest.js";

// get all bloodbank req
export const getBloodReqQuery=()=>{
      return bloodBankReqModel.find()
    .populate("user_id", "role")
    .populate("blood_bank_id", "blood_type available_unit");
   
}

// get all bloodbank req by id
// get all patient by id
export const getBloodReqByIdQuery = (id) => {
  return bloodBankReqModel.findById(id)
    .populate("user_id", "role")
    .populate("blood_bank_id", "blood_type available_unit");
}