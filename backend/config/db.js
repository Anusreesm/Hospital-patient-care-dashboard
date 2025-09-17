import mongoose from "mongoose";

const connectDB=async ()=>{
    try{
         const db=await mongoose.connect(process.env.MONGO_URI)
         console.log(`mongoDB connected successfully `)
    }
    catch(err)
    {
        console.error("MongoDB connection failed:", err.message);
    }
}
export default connectDB