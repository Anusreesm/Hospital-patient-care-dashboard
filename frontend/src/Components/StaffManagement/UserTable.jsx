// src/Components/StaffManagement/UserTable.jsx
import { useEffect, useState } from "react";
import UserRow from "./UserRow";
import { GetAllUsers } from "../../api/AuthApi";
import toast from "react-hot-toast";
import HospStaffReg from "../../Pages/Admin/UserManagement/hospStaffRegister";
import PatientCreate from "../../Pages/Common/patientManagement/patientCreate";
import PageWrapper from "../pageWrappers";

const UserTable = ({ staff = [] }) => {
    const [users, setUsers] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null); // For modal
    const [showModal, setShowModal] = useState(false);

    //  Fetch all users
    const fetchUsers = async () => {
        try {
            const res = await GetAllUsers();
             console.log("USER SAMPLE:", res.data?.users?.[0]); 
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
        <PageWrapper>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-3 sm:p-4 w-full">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">
                Users ({users.length})
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                Manage user accounts
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-[600px] sm:min-w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                            <th className="py-2">User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Join Date</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 dark:text-gray-200">
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
                                <td colSpan="6" className="text-center py-4 text-gray-500 dark:text-gray-400">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {showModal && selectedStaff && (
                <>
                  
                        <HospStaffReg
                            mode="update"
                            existingStaff={selectedStaff}
                            onClose={(updated) => {
                                setShowModal(false);
                                if (updated) handleUpdateSuccess();
                            }}
                        />
                
                </>
            )}

            {/* Modal 
            {showModal && selectedStaff && (
                <HospStaffReg
                    mode="update"
                    existingStaff={selectedStaff}
                    onClose={(updated) => {
                        setShowModal(false);
                        if (updated) handleUpdateSuccess(); // Refresh table instantly
                    }}
                />
            )} */}
        </div>
        </PageWrapper>
    );
};

export default UserTable;
