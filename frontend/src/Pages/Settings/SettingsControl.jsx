import { Link } from "react-router-dom";
import Navbar from "../../Components/Layouts/Navbar";
import Sidebar from "../../Components/Layouts/Sidebar";
import { useAuth } from "../../Context/AuthContext";
import PageWrapper from "../../Components/pageWrappers";

const SettingsPage = () => {
  const { userRole } = useAuth()
  return (
    <PageWrapper>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />

          {/* Cards area */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* -------------- COMMON TO ALL USERS -------------- */}
              <Link
                to={`/${userRole}/settings/changeUserPassword`}
                className="p-4 border rounded-xl shadow bg-white dark:bg-gray-800 
             hover:shadow-lg hover:scale-[1.02] transition-all 
             h-32 flex flex-col justify-between"
              >
                <h3 className="text-lg font-semibold">Change Password</h3>
                <p className="text-sm text-gray-500">
                  Change your account password
                </p>
              </Link>

              {/* -------------- ONLY FOR ADMIN -------------- */}
              {userRole === "admin" && (
                <>
                  <Link
                    to="/admin/settings/dept"
                    className="p-4 border rounded-xl shadow bg-white dark:bg-gray-800 
             hover:shadow-lg hover:scale-[1.02] transition-all 
             h-32 flex flex-col justify-between"
                  >
                    <h3 className="text-lg font-semibold">Department Master</h3>
                    <p className="text-sm text-gray-500">
                      Manage hospital departments
                    </p>
                  </Link>

                  <Link
                    to="/admin/settings/specz"
                    className="p-4 border rounded-xl shadow bg-white dark:bg-gray-800 
             hover:shadow-lg hover:scale-[1.02] transition-all 
             h-32 flex flex-col justify-between"
                  >
                    <h3 className="text-lg font-semibold">Specialization Master</h3>
                    <p className="text-sm text-gray-500">
                      Manage doctor specializations
                    </p>
                  </Link>

                  <Link
                    to="/admin/settings/changeUserStatus"
                    className="p-4 border rounded-xl shadow bg-white dark:bg-gray-800 
             hover:shadow-lg hover:scale-[1.02] transition-all 
             h-32 flex flex-col justify-between"
                  >
                    <h3 className="text-lg font-semibold">Change User Status</h3>
                    <p className="text-sm text-gray-500">
                      Activate / deactivate users
                    </p>
                  </Link>

                  <Link
                    to="/admin/settings/bloodStockAdj"
                    className="p-4 border rounded-xl shadow bg-white dark:bg-gray-800 
             hover:shadow-lg hover:scale-[1.02] transition-all 
             h-32 flex flex-col justify-between"
                  >
                    <h3 className="text-lg font-semibold">Blood Stock Adjustment</h3>
                    <p className="text-sm text-gray-500">
                      Update physical blood inventory
                    </p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
export default SettingsPage;