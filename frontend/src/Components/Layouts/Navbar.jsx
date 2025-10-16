import { useAuth } from "../../Context/AuthContext";

const Navbar = () => {
    const {userRole,userName,LogoutHandler}=useAuth()
    // / Get the first letter of the name for the profile circle
  const initial = userName ? userName.charAt(0).toUpperCase() : "?";

  return (
 <div className="navbar bg-white shadow-sm h-16 flex items-center">
  <div className="flex items-center  space-x-7 ml-auto mr-6">
    <div className="text-right flex flex-col items-center">
      <p className="font-medium">{userName}</p>
      <p className="text-sm text-gray-500 capitalize">{userRole}</p>
    </div>
    <div
      className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold cursor-pointer hover:bg-red-600 transition-colors duration-300"
      onClick={LogoutHandler}
      title="Logout"
    >
      {initial}
    </div>
  </div>
</div>

  );
};

export default Navbar;
