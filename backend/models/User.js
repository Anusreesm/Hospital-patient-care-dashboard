import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
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
        },
        lastLoginAt: {
            type: Date,
            default: null,
        },

        // new field
        isActive: {
            type: Boolean,
            default: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        // forgot pw
        resetPasswordToken:{
            type:String,
            default:null
        },
        resetPasswordExpires:{
            type:Date,
            default:null
        }
    },
   
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);
 userSchema.index({ email: 1 });
const userModel = mongoose.model("User", userSchema)
export default userModel