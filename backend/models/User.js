import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["patient", "staff", "doctor", "admin"],
            default: "patient"
        },
        status: {
            type: String,
            enum: ["active", "deactivated"],
            default: "active"
        }

    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
)
const userModel = mongoose.model("User", userSchema)
export default userModel