import { useEffect, useState } from "react";
import toast from "react-hot-toast"
import { ChangeStatus, deleteUser, GetAllUsers } from "../../api/AuthApi";
import Sidebar from "../../Components/Layouts/Sidebar";
import Navbar from "../../Components/Layouts/Navbar";
import { verifyDelete } from "../../Utils/Alerts/ErrorAlert";
import { DeleteItems } from "../../Utils/Alerts/SuccessAlert";
const ChangeUserStatus = () => {
    // to store the list of users 
    const [users, setUsers] = useState([]);
    // to keep track of user status changes in the dropdown before updating
    const [statusChange, setStatusChange] = useState({});

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                // to fetch all users
                const res = await GetAllUsers();
                if (res.success) {
                    console.log(res.data.users)
                    // store users in state
                    setUsers(res.data.users);
                } else {
                    // if api fails
                    toast.error(res.message || "Failed to fetch users");
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                toast.error("Something went wrong while fetching users");
            }
        };
        fetchUsers();
    }, []);
    // when a dropdown (status) is changed for a user
    const handleSelectChange = (id, value) => {
        // updates only with user id  [id]:value

        setStatusChange((prev) => ({ ...prev, [id]: value }));
    };

    // update status API call
    const handleUpdateStatus = async (id) => {
        // get new status for user by id
        const newStatus = statusChange[id];
        // if status is selected
        if (!newStatus) {
            toast.error("Please select a status before updating");
            return;
        }
        try {
            // api-update status
            const res = await ChangeStatus({ id, status: newStatus });
            if (res.success) {
                // update the user list in state to reflect the new status
                setUsers((prev) =>
                    prev.map((user) =>
                        user._id === id ? { ...user, status: newStatus } : user
                    )
                );
                toast.success(`User status updated to ${newStatus}`);
            } else {
                toast.error(res.message || "Failed to update status");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            toast.error("Something went wrong while updating");
        }
    };
    const handleDelete = async (id) => {
        const confirmed = await verifyDelete("user");
        if (!confirmed) return;
        try {
            const res = await deleteUser(id);
            if (res.success) {
                setUsers((prev) => prev.filter((users) => users._id !== id));
                // success toast
                DeleteItems("User");
            } else {
                toast.error(res.message || "Failed to delete User");
            }
        }
        catch (err) {
            toast.error("Error deleting user", err)
        }
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />

                      {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">
                            User Control Panel
                        </h2>

                        {/* Table Container */}
                        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
                            <table className="min-w-[600px] w-full text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700 text-xs sm:text-sm">
                                        <th className="p-3 text-left">#</th>
                                        <th className="p-3 text-left">Name</th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">Role</th>
                                        <th className="p-3 text-left">Status</th>
                                        <th className="p-3 text-left">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user, index) => (
                                            <tr
                                                key={user._id}
                                                className="border-b hover:bg-gray-50 text-xs sm:text-sm"
                                            >
                                                <td className="p-3 whitespace-nowrap">{index + 1}</td>
                                                <td className="p-3 whitespace-nowrap">{user?.name}</td>
                                                <td className="p-3 whitespace-nowrap text-gray-600">
                                                    {user.email}
                                                </td>
                                                <td className="p-3 capitalize">{user.role}</td>
                                                <td className="p-3">
                                                    <select
                                                        value={statusChange[user._id] || user.status}
                                                        onChange={(e) =>
                                                            handleSelectChange(user._id, e.target.value)
                                                        }
                                                        className="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="deactivated">Deactivated</option>
                                                    </select>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <button
                                                            onClick={() => handleUpdateStatus(user._id)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs sm:text-sm transition"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs sm:text-sm transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="text-center py-4 text-gray-500 text-sm"
                                            >
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>



                </div>
            </div>
        </>
    )
};
export default ChangeUserStatus;

