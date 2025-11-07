import { useAuth } from "../../Context/AuthContext";

const Navbar = () => {
  const { userRole, userName, LogoutHandler } = useAuth();
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";

  return (
   <>
 
    <div className="navbar bg-white shadow-sm h-16 flex items-center px-3 sm:px-6">
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
          onClick={LogoutHandler}
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
