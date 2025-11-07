import {  useState } from "react"
import Navbar from "../../../Components/Layouts/Navbar"
import Sidebar from "../../../Components/Layouts/Sidebar"
import { NavLink } from "react-router-dom"
import UserTable from "../../../Components/StaffManagement/UserTable"

import { GetAllPatients } from "../../../api/PatientApi"
import { GetAllReg } from "../../../api/RegApi"


const PatientManagement = () => {
    // to find total
    const [totals, setTotals] = useState({
        total: 0,
        active: 0,
        discharged: 0,
        deleted: 0,
        // appointments: 0
    })
   

    const stats = [
        { label: "Total Patients", value: totals.total, color: "text-black-600" },
        { label: "Active Patients", value: totals.active, color: "text-green-600" },
        { label: "Discharged Patients", value: totals.discharged, color: "text-orange-600" },
        { label: "Deleted Patients", value: totals.deleted, color: "text-red-600" },
        { label: "With Appointments", value: totals.appointments, color: "text-blue-600" },
    ]
    return (
        <>
            <div className="flex flex-col sm:flex-row min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />

                    <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-lg sm:text-2xl font-semibold text-gray-800">
                                Patient Management
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-base">
                                Manage patient records and medical information
                            </p>
                        </div>
                        {/* to display totals */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                            {
                                stats.map((item) => (
                                    <div key={item.label} className="p-4 rounded-lg shadow bg-white">
                                        <p className="font-semibold">{item.label}</p>
                                        <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                                    </div>
                                ))}
                        </div>
                        {/* next section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-3 sm:p-4 rounded-xl shadow-sm gap-3">
                            {/* selection of status */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm">
                                    <option>All Patients</option>
                                    <option>Active</option>
                                    <option>Discharged</option>
                                    <option>Deleted</option>
                                </select>

                                <NavLink
                                    to="/admin/staff/register"
                                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-center text-sm"
                                >
                                    + create new patient
                                </NavLink>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
export default PatientManagement