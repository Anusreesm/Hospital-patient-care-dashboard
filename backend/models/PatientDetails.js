import mongoose, { model } from "mongoose";
const patientDetailsSchema = new mongoose.Schema(
    {
        addresses_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Addresses",
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true
        },
        blood_type: {
            type: String,
            required: true
        },
        emergency_name: {
            type: String,
            required: true
        },
        emergency_contact: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);
const patientDetailsModel = mongoose.model("PatientDetails", patientDetailsSchema)
export default patientDetailsModel