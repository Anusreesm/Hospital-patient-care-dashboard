import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js"

dotenv.config()
console.log("JWT_KEY:", process.env.SECRET_KEY);

const PORT= process.env.PORT
connectDB()
app.listen(PORT,()=> console.log(`Server running on ${PORT}`))
