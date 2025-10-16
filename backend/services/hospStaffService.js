import hospitalStaffModel from "../models/HospitalStaff.js";

//  GET all staff
export const staffQuery = () => {
  return hospitalStaffModel.find()
    .populate("user_id", "role status email")
    .populate("dept_id", "dept_name")
    .populate("specialization_id", "spec_name");
};

// For single staff
export const staffByIdQuery = (id) => {
  return hospitalStaffModel.findById(id)
    .populate("user_id", "role status email")
    .populate("dept_id", "dept_name")
    .populate("specialization_id", "spec_name");
};