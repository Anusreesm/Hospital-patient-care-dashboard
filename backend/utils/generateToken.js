import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config({ path: './.env' })
const generateToken = (id, role,name) => {
    return jwt.sign(
        { id, role, name },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
    );
};
console.log("secret_key:", process.env.SECRET_KEY)
export default generateToken
