import { useEffect, useState } from "react"
import Navbar from "../../../Components/Layouts/Navbar"
import Sidebar from "../../../Components/Layouts/Sidebar"
import { NavLink } from "react-router-dom"
import UserTable from "../../../Components/StaffManagement/UserTable"


import { GetAllReg } from "../../../api/RegApi"
import toast from "react-hot-toast"
import { GetAllAppointment } from "../../../api/AppointmentApi"
import PatientTable from "../../../Components/patientManagement/patientTable"
import { useAuth } from "../../../Context/AuthContext"
import PageWrapper from "../../../Components/pageWrappers"


const PatientManagement = () => {
    const { userRole } = useAuth();
    const [filterStatus, setFilterStatus] = useState("All patients");
    const [patient, setPatient] = useState([])
    const [filteredPatient, setFilteredPatient] = useState([])
    // to find total
    const [totals, setTotals] = useState({
        total: 0,
        active: 0,
        discharged: 0,
        deleted: 0,
        appointments: 0
    })
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await GetAllReg();
                const appRes = await GetAllAppointment();

                let patient = res?.data?.reg || [];

                let uniquePatients = [];
                let seen = new Set();
                patient.forEach(r => {
                    const pid = r?.patient_id?._id;
                    if (pid && !seen.has(pid)) {
                        seen.add(pid);
                        uniquePatients.push(r);
                    }
                });





                let appointments = appRes?.data?.appointments || [];

                const activePatients = uniquePatients.filter(p => p.status === "active");
                const dischargedPatients = uniquePatients.filter(p => p.status === "discharged");
                const deletedPatients = uniquePatients.filter(p => p.status === "deleted");

                const confirmedAppointments = appointments.filter(a => a.status === "confirmed");
                console.log(confirmedAppointments)
                setPatient(uniquePatients)
                setFilteredPatient(uniquePatients)
                setTotals({
                    total: uniquePatients.length,
                    active: activePatients.length,
                    discharged: dischargedPatients.length,
                    deleted: deletedPatients.length,
                    appointments: confirmedAppointments.length
                });

            } catch (error) {
                console.log(error);
                toast.error("Error fetching users");
            }
        };

        fetchPatients();
    }, []);
    // search  
    useEffect(() => {

        if (filterStatus === "All Patients") {
            setFilteredPatient(patient);
        }
        else if (filterStatus === "Confirmed Appointments") {
            // Filter patients that HAVE confirmed appointments
            setFilteredPatient(patient.filter(p =>
                p.appointment_status === "confirmed"
            ));
        }
        else {
            const key = filterStatus.toLowerCase();
            setFilteredPatient(patient.filter(a => a.status === key));
        }
    }, [filterStatus, patient]);


    const stats = [
        { label: "Total Patients", value: totals.total, color: "text-black-600" },
        { label: "Active Patients", value: totals.active, color: "text-green-600" },
        { label: "Discharged Patients", value: totals.discharged, color: "text-orange-600" },
        { label: "Deleted Patients", value: totals.deleted, color: "text-red-600" },
        { label: "Confirmed-Appointments", value: totals.appointments, color: "text-blue-600" },
    ]
    return (
        <>
            <PageWrapper>
                <div className="flex flex-col sm:flex-row min-h-screen ">
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Navbar />

                        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                                    Patient Management
                                </h1>
                                <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">
                                    Manage patient records and medical information
                                </p>
                            </div>
                            {/* to display totals */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {stats.map((item) => (
                                    <div
                                        key={item.label}
                                        className="p-4 rounded-lg shadow 
                                               bg-white dark:bg-gray-800 
                                               text-gray-800 dark:text-gray-100"
                                    >
                                        <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                        <p className={`mt-2 text-3xl font-bold ${item.color}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            {/* next section */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                                        bg-white dark:bg-gray-800 
                                        p-3 sm:p-4 rounded-xl shadow-sm gap-3">
                                {/* selection of status */}
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <select className="border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-700 
                                               text-gray-800 dark:text-gray-100
                                               rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option>All Registrations</option>
                                        <option>Active</option>
                                        <option>Discharged</option>
                                        <option>Deleted</option>
                                    </select>

                                    {(userRole === "admin" || userRole === "staff" || userRole === "doctor") && (
                                        <NavLink
                                            to={`/${userRole}/patient/create`}
                                            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-center text-sm"
                                        >
                                            + create new patient
                                        </NavLink>
                                    )}
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto bg-white dark:bg-gray-800 
                                        rounded-lg shadow p-2">
                                <PatientTable
                                    patient={filteredPatient}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </PageWrapper>
        </>
    )
}
export default PatientManagement