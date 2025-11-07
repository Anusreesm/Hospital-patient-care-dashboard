// src/Layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Sidebar = () => {
  const { userRole, LogoutHandler } = useAuth();

  return (

    //  {/* Sidebar hidden on mobile */}
    <div className="hidden sm:block ">
      <div className="sidebar bg-white shadow-md w-64 h-screen p-5">
        <h2 className="text-2xl font-bold mb-8 text-blue-700">MedTech HMS</h2>
        <ul className="space-y-4">
          {/* Dashboard -for all */}
          <li>
            <NavLink to={`/${userRole}`} className="block py-2 px-3 rounded hover:bg-blue-100">
              Dashboard
            </NavLink>
          </li>
          {/* Admin only */}
          {userRole === "admin" && (
            <>

              <li>
                <NavLink to="/admin/staff" className="block py-2 px-3 rounded hover:bg-blue-100">
                  User Management
                </NavLink>
              </li>
            </>
          )}
          {/* admin and staff */}
          {(userRole === "admin" || userRole === "staff") && (
            <>
              <li>
                <NavLink to="/patientManagement" className="block py-2 px-3 rounded hover:bg-blue-100">
                  Patient Management
                </NavLink>
              </li>
            </>
          )}
          {/* common to all users */}
            {(userRole === "admin" || userRole === "staff" ||userRole ==="doctor" ||userRole==="patient") && (
            <>
              <li>
                <NavLink to="/appointmentManagement" className="block py-2 px-3 rounded hover:bg-blue-100">
                  Appointment Management
                </NavLink>
              </li>
            </>
          )}
          {/* settings-admin */}
          {userRole === "admin" && (
            <>
              <li>
                <NavLink to="/admin/settings" className="block py-2 px-3 rounded hover:bg-blue-100">
                  Settings
                </NavLink>
              </li>
            </>
          )}
        </ul>
        <div
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors cursor-pointer"
          onClick={LogoutHandler}
          title="Logout"
        >Logout</div>
      </div>
    </div>
  );
};
export default Sidebar;
