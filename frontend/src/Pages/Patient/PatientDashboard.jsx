import Navbar from "../../Components/Layouts/Navbar";
import Sidebar from "../../Components/Layouts/Sidebar";
import { useAuth } from "../../Context/AuthContext";

const PatientDashboard=()=>{
    const { userName } = useAuth(); 
         
       return (
           <div className="flex">
               <Sidebar />
               <div className="flex-1 bg-gray-50 min-h-screen">
                   <Navbar />
                   <div className="p-6">
                       <h1 className="text-2xl font-semibold mb-4">Welcome back {userName}</h1>
                       <p>Overview of hospital operations.</p>
                   </div>
               </div>
           </div>
       );
   };
export default PatientDashboard