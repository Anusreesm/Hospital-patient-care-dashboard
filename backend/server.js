import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js"
import deptModel from "./models/DepartmentMaster.js";
import specializationModel from "./models/SpecializationMaster.js";
import appointmentModel from "./models/Appointment.js";

dotenv.config({ path: './.env' })

const PORT = process.env.PORT

connectDB()
    .then(async () => {
        console.log("MongoDB connected successfully");

        // Ensure 'doctor' department exists
        const doctorDept = await deptModel.findOne({ dept_name: "doctor" });
        if (!doctorDept) {
            await deptModel.create({ dept_name: "doctor" });
            console.log(" Default 'doctor' department created");
        } else {
            console.log(" 'doctor' department already exists");
        }

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
