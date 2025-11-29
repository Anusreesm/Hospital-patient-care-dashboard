import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useEffect } from "react";
import { ArrowLeftCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";


const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // <-- get theme and toggle
  const { userRole, userName, LogoutHandler, token } = useAuth();
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";
  // const handleBack = () => {
  //   if (userRole === "admin") navigate("/admin");
  //   else if (userRole === "staff") navigate("/staff");
  //   else if (userRole === "doctor") navigate("/doctor");
  //   else if (userRole === "patient") navigate("/patient");
  //   else navigate("/"); // fallback if userRole missing
  // };
  useEffect(() => {
    if (!token || !userRole) {
      navigate("/");
    }
  }, [token, userRole, navigate]);
  const handleBack = () => {
    navigate(-1); //  Goes to previous page in history
  };

  const isDashboardPage =
    location.pathname === "/admin" ||
    location.pathname === "/staff" ||
    location.pathname === "/doctor" ||
    location.pathname === "/patient";

  return (
    <>

      <div className="navbar bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-3 sm:px-6 transition-colors duration-300">


        <div className="flex flex-row gap-3">
          <button
            onClick={handleBack}
            className={`p-2 rounded-full bg-blue-500 text-white hover:bg-green-600 transition duration-200 ${isDashboardPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
            title="back"
            disabled={isDashboardPage}
          >
            <ArrowLeftCircle className="w-5 h-5" />
          </button>
          {/* Right side */}
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle Dark Mode"
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

        </div>
        {/* Main container */}
        <div className="flex items-center ml-auto space-x-3 sm:space-x-6">


          {/* User Info */}
          <div className="flex flex-col items-end text-right leading-tight">
            <p className="font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[150px]">
              {userName || "User"}
            </p>

            <p className="text-[10px] sm:text-xs text-gray-500 capitalize truncate max-w-[80px] sm:max-w-[120px]">
              {userRole || "role"}
            </p>
          </div>

          {/* Profile Circle / Logout */}
          <button
            onClick={() => {
              LogoutHandler();
              navigate("/");
            }}
            title="Logout"

            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold hover:bg-red-600 transition-colors duration-300"
          >
            {initial}
          </button>
        </div>








      </div>
    </>
  );
};

export default Navbar;
