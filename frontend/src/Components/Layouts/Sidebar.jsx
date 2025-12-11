
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useState } from "react";
import { Menu, X, Home, ArrowLeftCircle } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";
const Sidebar = () => {
  const navigate = useNavigate()
  const { userRole, LogoutHandler } = useAuth();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const handleBackToDashBoard = () => {
    if (userRole === "admin") navigate("/admin");
    else if (userRole === "staff") navigate("/staff");
    else if (userRole === "doctor") navigate("/doctor");
    else if (userRole === "patient") navigate("/patient");
    else navigate("/"); // fallback if userRole missing
  };
  console.log(theme)
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="sm:hidden flex justify-between items-center p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-40  bg-white dark:bg-gray-800 transition-colors duration-300">
        <h2 className="text-xl font-bold text-blue-700">MedTech HMS</h2>
        <div className="flex flex-row gap-2">
          <button
            onClick={handleBack}
            className={`p-2 rounded-full bg-blue-500 text-white hover:bg-green-600 transition duration-200 
            }`}
            title="Back"

          >
            <ArrowLeftCircle className="w-5 h-5" />
          </button>
          <button
            onClick={handleBackToDashBoard}
            className={`p-2 rounded-full bg-blue-500 text-white hover:bg-green-600 transition duration-200 
            }`}
            title="Go to Dashboard"

          >
            <Home className="w-5 h-5" />
          </button>



          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>

          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-5 z-50
           bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-8 text-blue-700 dark:text-blue-400">MedTech HMS</h2>
            <ul className="space-y-4">
              <li>
                <NavLink
                  to={`/${userRole}`}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Dashboard
                </NavLink>
              </li>

              {userRole === "admin" && (
                <li>
                  <NavLink
                    to="/admin/staff"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    User Management
                  </NavLink>
                </li>
              )}

              {(userRole === "admin" || userRole === "staff" || userRole === "doctor") && (
                <>
                  <li>
                    <NavLink
                      to="/patientManagement"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Patient Management
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to='/bloodBankManagement'
                      className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setIsOpen(false)}>
                      BloodBank Management
                    </NavLink>
                  </li>
                </>
              )}

              {(userRole === "admin" ||
                userRole === "staff" ||
                userRole === "doctor" ||
                userRole === "patient") && (
                  <li>
                    <NavLink
                      to="/appointmentManagement"
                      onClick={() => setIsOpen(false)}
                      className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Appointment Management
                    </NavLink>
                  </li>
                )}

              <li>
                <NavLink
                  to={`/${userRole}/settings`}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
                >
                  Settings
                </NavLink>
              </li>

            </ul>

            <div
              className="bg-blue-700 dark:bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-500 transition-all cursor-pointer mt-5 text-center"
              onClick={() => {
                setIsOpen(false);
                LogoutHandler();
                navigate("/");
              }}
              title="Logout"
            >
              Logout
            </div>
          </div>
        </>
      )}

      {/* desktop sidebar */}
      <div className="hidden sm:block fixed top-0 left-0 w-64 h-screen overflow-y-auto shadow-md bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 z-40">
        <div className="sidebar w-64 h-screen p-5 flex flex-col justify-between shadow-md
            bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
          <div>
            <h2 className="text-2xl font-bold mb-8 text-blue-700 dark:text-blue-400">MedTech HMS</h2>
            <ul className="space-y-4">

              <li>
                <NavLink to={`/${userRole}`} className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
                  Dashboard
                </NavLink>
              </li>

              {userRole === "admin" && (
                <li>
                  <NavLink to="/admin/staff" className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
                    User Management
                  </NavLink>
                </li>
              )}

              {(userRole === "admin" || userRole === "staff" || userRole === "doctor") && (
                <>
                  <li>
                    <NavLink to="/patientManagement" className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
                      Patient Management
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to='/bloodBankManagement' className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
                      BloodBank Management
                    </NavLink>
                  </li>
                </>
              )}

              {(userRole === "admin" ||
                userRole === "staff" ||
                userRole === "doctor" ||
                userRole === "patient") && (
                  <li>
                    <NavLink to="/appointmentManagement" className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors">
                      Appointment Management
                    </NavLink>
                  </li>
                )}

              <li>
                <NavLink
                  to={`/${userRole}/settings`}
                  className="block py-2 px-3 rounded hover:bg-blue-100 dark:hover:bg-gray-700"
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </div>

          {/* LOGOUT AT BOTTOM */}
          <div
            className="bg-blue-500 dark:bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-500 transition-all cursor-pointer text-center"
            onClick={() => {
              setIsOpen(false);
              LogoutHandler();
              navigate("/");
            }}
            title="Logout"
          >
            Logout
          </div>
        </div>
      </div>

    </>
  );
};
export default Sidebar;
