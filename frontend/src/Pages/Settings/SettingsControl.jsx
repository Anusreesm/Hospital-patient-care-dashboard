import { NavLink } from "react-router-dom";
import Navbar from "../../Components/Layouts/Navbar";
import Sidebar from "../../Components/Layouts/Sidebar";
import { useAuth } from "../../Context/AuthContext";

const SettingsPage = () => {
    const { userRole } = useAuth()
    return (
        <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Cards area */}
        {userRole === "admin" && (
          <div className="grid  grid-cols-2 gap-5  p-4  mt-4">
            <NavLink
              to="/admin/settings/dept"
              className="bg-white shadow-md rounded-lg h-24 flex items-center justify-center hover:bg-blue-500 hover:text-white transition cursor-pointer"
            >
              Department Master
            </NavLink>

            <NavLink
              to="/admin/settings/specz"
              className="bg-white shadow-md rounded-lg h-24 flex items-center justify-center hover:bg-blue-500 hover:text-white transition cursor-pointer"
            >
              Specialization Master
            </NavLink>

          

               <NavLink
              to="/admin/settings/changeUserStatus"
              className="bg-white shadow-md rounded-lg h-24 flex items-center justify-center hover:bg-blue-500 hover:text-white transition cursor-pointer"
            >
           User Controlpanel
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};
export default SettingsPage;