import toast from "react-hot-toast";
import Navbar from "../../../Components/Layouts/Navbar";
import Sidebar from "../../../Components/Layouts/Sidebar";
import { changeUserPw } from "../../../api/AuthApi";
import { useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../Components/pageWrappers";

const ChangeUserPassword = () => {
  const { user, LogoutHandler } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id;

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password & Confirm password do not match");
      return;
    }

    try {
      const res = await changeUserPw(userId, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      if (res.success) {
        toast.success("Password updated successfully! Logging out...");

        setTimeout(() => {
          LogoutHandler();
          navigate("/login");
        }, 1500);
      } else {
        toast.error(res.message || "Failed to update password");
      }
    } catch (error) {
        console.log(error)
      toast.error("Something went wrong");
    }
  };

  return (
    <PageWrapper>
     <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />

     <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <div className="flex justify-center items-center mt-10 px-4">
         <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 border dark:border-gray-700">
           <h2 className="text-2xl font-semibold mb-6 text-blue-700 dark:text-blue-300 text-center">
              Change Password
            </h2>

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
              target="_self"
            >
              {/* Old Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none 
                             focus:ring-2 focus:ring-blue-400 
                             bg-white dark:bg-gray-700 
                             text-gray-900 dark:text-gray-100
                             border-gray-300 dark:border-gray-600"
                  placeholder="Enter your old password"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none 
                             focus:ring-2 focus:ring-blue-400 
                             bg-white dark:bg-gray-700 
                             text-gray-900 dark:text-gray-100
                             border-gray-300 dark:border-gray-600"
                  placeholder="Enter a new password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg outline-none 
                             focus:ring-2 focus:ring-blue-400 
                             bg-white dark:bg-gray-700 
                             text-gray-900 dark:text-gray-100
                             border-gray-300 dark:border-gray-600"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 
                           text-white py-2 rounded-lg font-medium 
                           transition-all dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Update Password
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
};

export default ChangeUserPassword;
