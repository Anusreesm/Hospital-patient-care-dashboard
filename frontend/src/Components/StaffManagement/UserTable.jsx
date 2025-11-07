// src/Components/StaffManagement/UserTable.jsx
import { useEffect, useState } from "react";
import UserRow from "./UserRow";
import { GetAllUsers } from "../../api/AuthApi";
import toast from "react-hot-toast";
import HospStaffReg from "../../Pages/Admin/UserManagement/hospStaffRegister";

const UserTable = ({ staff = [] }) => {
    const [users, setUsers] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null); // For modal
    const [showModal, setShowModal] = useState(false);

    //  Fetch all users
    const fetchUsers = async () => {
        try {
            const res = await GetAllUsers();
            if (Array.isArray(res?.data?.users)) {
                setUsers(res.data.users);
            } else {
                toast.error("Unexpected data format");
                setUsers([]);
            }
        } catch (error) {
            toast.error("Error fetching users", error);
            setUsers([]);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

       // Sync filtered data from parent component
    useEffect(() => {
        if (staff?.length) {
            setUsers(staff);
        } else {
            setUsers([]);
        }
    }, [staff]);
    const handleDelete = (deletedId) => {
        setUsers((prev) => prev.filter((usr) => usr._id !== deletedId));
    };

    const handleEdit = (userData) => {
        setSelectedStaff(userData);
        setShowModal(true);
    };
    // Called when staff updated successfully
    const handleUpdateSuccess = async () => {
        await fetchUsers(); // Re-fetch latest data after update

    };
    return (
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 w-full">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1">
                Users ({users.length})
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                Manage user accounts
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-[600px] sm:min-w-full text-sm text-left">
                    <thead>
                        <tr className="border-b text-gray-600 text-xs sm:text-sm">
                            <th className="py-2">User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Join Date</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((u) => (
                                <UserRow
                                    key={u._id}
                                    id={u._id}
                                    name={u.name}
                                    email={u.email}
                                    role={u.role}
                                    status={u.status}
                                    created_at={u.created_at}
                                    lastLoginAt={u.lastLoginAt}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal  */}
            {showModal && selectedStaff && (
                <HospStaffReg
                    mode="update"
                    existingStaff={selectedStaff}
                    onClose={(updated) => {
                        setShowModal(false);
                        if (updated) handleUpdateSuccess(); // Refresh table instantly
                    }}
                />
            )}
        </div>
    );
};

export default UserTable;
