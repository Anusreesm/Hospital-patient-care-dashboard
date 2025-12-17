import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js"


dotenv.config({ path: './.env' })

const PORT = process.env.PORT

connectDB()
    .then(async () => {
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("DB connection failed:", err);
        process.exit(1);
    });
