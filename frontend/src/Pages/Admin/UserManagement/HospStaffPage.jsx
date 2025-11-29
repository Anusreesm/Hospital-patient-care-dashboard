import { NavLink } from "react-router-dom";
import Navbar from "../../../Components/Layouts/Navbar";
import Sidebar from "../../../Components/Layouts/Sidebar";
import UserTable from "../../../Components/StaffManagement/UserTable";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GetAllUsers } from "../../../api/AuthApi";
import Input from "../../../Components/Forms/Input";
import PatientCreateForm from "../../Common/patientManagement/patientCreateForm";
import HospStaffForm from "./HospStaffForm";
import PageWrapper from "../../../Components/pageWrappers";

const HospStaff = () => {
    const [staff, setStaff] = useState([])
    const [filterStatus, setFilterStatus] = useState("All Roles");
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [editData, setEditData] = useState(null);

    const closeModal = () => setEditData(null);
    // to find total
    const [totals, setTotals] = useState({
        users: 0,
        admins: 0,
        doctors: 0,
        patients: 0,
        staffs: 0,
        active: 0
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await GetAllUsers();

                console.log(res.data.users[0]);
                if (Array.isArray(res?.data?.users)) {
                    const users = res.data.users;
                    setStaff(users)
                    // Count each type 
                    const admins = users.filter(u => u.role === "admin").length;
                    const doctors = users.filter(u => u.role === "doctor").length;
                    const patients = users.filter(u => u.role === "patient").length;
                    const staffs = users.filter(u => u.role === "staff").length;
                    const active = users.filter(u => u.status === "active").length;

                    // Update state as an object
                    setTotals({
                        users: users.length,
                        admins,
                        doctors,
                        patients,
                        staffs,
                        active
                    });
                } else {
                    toast.error("Unexpected data format");
                }

            } catch (error) {
                console.error(error);
                toast.error("Error fetching users");
            }
        };

        fetchUsers();
    }, []);
    useEffect(() => {
        if (filterStatus === "All Roles") {
            setFilteredStaff(staff);
        } else {
            setFilteredStaff(staff.filter((u) => u.role.toLowerCase() === filterStatus.toLowerCase()));
        }
    }, [filterStatus, staff]);


    const stats = [
        { label: "Total Users", value: totals.users, color: "text-blue-600" },
        { label: "Admins", value: totals.admins, color: "text-red-600" },
        { label: "Doctors", value: totals.doctors, color: "text-green-600" },
        { label: "Staff", value: totals.staffs, color: "text-purple-600" },
        { label: "Patients", value: totals.patients, color: "text-orange-600" },
        { label: "Active", value: totals.active, color: "text-emerald-600" },
    ];


    return (
        <>

            <PageWrapper>
                {/* ---------- MODAL SECTION ---------- */}
                {editData && (
                    <>
                        {editData.role?.toLowerCase() === "patient" ? (

                            <PatientCreateForm
                                mode="update"
                                existingPatient={editData}
                                onClose={closeModal}
                            />
                        ) : (
                            <HospStaffForm
                                mode="update"
                                existingStaff={editData}
                                onClose={closeModal}
                            />
                        )}
                    </>
                )}
                {/* ---------- END MODAL ---------- */}
                <div className="flex flex-col sm:flex-row min-h-screen">
                    <Sidebar />

                    {/* Main content */}
                    <div className="flex-1 flex flex-col">
                        <Navbar />

                        {/* Scrollable area */}
                        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                                    User Management
                                </h1>
                                <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">
                                    Manage hospital users, roles, and permissions
                                </p>
                            </div>

                            {/* totals */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                                {stats.map((item) => (
                                    <div key={item.label} className="p-4 rounded-lg shadow 
                                               bg-white dark:bg-gray-800 
                                               text-gray-800 dark:text-gray-100">
                                        <p className="font-semibold">{item.label}</p>
                                        <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Search & Filter */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                                        bg-white dark:bg-gray-800 
                                        p-3 sm:p-4 rounded-xl shadow-sm gap-3">


                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <select
                                        className="border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-700 
                                               text-gray-800 dark:text-gray-100
                                               rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option>All Roles</option>
                                        <option>Admin</option>
                                        <option>Doctor</option>
                                        <option>Staff</option>
                                        <option>Patient</option>
                                    </select>

                                    <NavLink
                                        to="/admin/staff/register"
                                        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-center text-sm"
                                    >
                                        + create new user
                                    </NavLink>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto  bg-white dark:bg-gray-800 
                                        rounded-lg shadow p-2">
                                <UserTable staff={filteredStaff} />
                            </div>
                        </div>
                    </div>
                </div>
            </PageWrapper>
        </>
    );

};

export default HospStaff;
