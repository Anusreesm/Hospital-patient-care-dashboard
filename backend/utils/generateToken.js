import jwt from "jsonwebtoken"

const generateToken=(id,role) => {
    return jwt.sign(
        {id,role},
        process.env.SECRET_KEY || "secret123",
        { expiresIn: "1h"}
);
};
export default generateToken