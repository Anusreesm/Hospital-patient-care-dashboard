import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";
import deptModel from "../models/DepartmentMaster.js";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedDoctorDepartment = async () => {
  try {
    await connectDB();

    const doctorDept = await deptModel.findOne({ dept_name: "doctor" });
    if (!doctorDept) {
      await deptModel.create({ dept_name: "doctor" });
      console.log("Doctor department created");
    } else {
      console.log("Doctor department already exists");
    }

    process.exit(0); // Exit after seeding
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDoctorDepartment();
