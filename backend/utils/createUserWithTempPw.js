import crypto from "crypto";
import bcrypt from "bcrypt"
import userModel from "../models/User.js";

const createUserWithTempPw=async (email, role, name)=>{
 const tempPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 8);

    const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role,       // dynamic
        status: 'active',
        
    });

    return { newUser, tempPassword };
}
export default createUserWithTempPw