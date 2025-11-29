import { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { GetAllAppointment } from "../../../api/AppointmentApi";
import toast from "react-hot-toast";
import Sidebar from "../../../Components/Layouts/Sidebar";
import Navbar from "../../../Components/Layouts/Navbar";
import { NavLink } from "react-router-dom";
import AppointTable from "../../../Components/AppointmentManagement/AppointTable";
import PageWrapper from "../../../Components/pageWrappers";

const AppointmentManagement = () => {

    const { user, userRole } = useAuth();
    const [appointment, setAppointment] = useState([])
    const [filterStatus, setFilterStatus] = useState("All Appointments");
    const [filteredAppointment, setFilteredAppointment] = useState([]);
    

    // to find total
    const [totals, setTotals] = useState({
        total: 0,
        today: 0,
        scheduled: 0,
        completed: 0,
        confirmed: 0,
        cancelled: 0,
        missed: 0

    })

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await GetAllAppointment();
                console.log(res.data.appointments[0]);
                if (Array.isArray(res?.data?.appointments)) {
                    let appoint = res.data.appointments;
                    //    count each type
                    if (userRole === "patient") {
                        appoint = appoint.filter(a => a.patient_id?.user_id?._id === user?.id);
                    } else if (userRole === "doctor") {
                        appoint = appoint.filter(a => a.hosp_staff_id?.user_id?._id === user?.id);
                    }

                    console.log("Fetched appointments:", res.data.appointments);
                    console.log("Current user:", user);
                    console.log("User role:", userRole);

                    setAppointment(appoint);
                     setFilteredAppointment(appoint);
                    if (userRole !== "patient") {
                        const todayStr = new Date().toISOString().split("T")[0];
                        const today = appoint.filter(a => {
                            const apptDate = new Date(a.date).toISOString().split("T")[0];
                            return apptDate === todayStr;
                        }).length;
                        const scheduled = appoint.filter(a => a.status === "scheduled").length;
                        const completed = appoint.filter(a => a.status === "completed").length;
                        const confirmed = appoint.filter(a => a.status === "confirmed").length;
                        const cancelled = appoint.filter(a => a.status === "cancelled").length;
                        const missed = appoint.filter(a => a.status === "missed").length;
                        // update state as an object
                        setTotals({
                            total: appoint.length,
                            today,
                            scheduled,
                            completed,
                            confirmed,
                            cancelled,
                            missed
                        });
                    }
                } else {
                    toast.error("Unexpected data format");
                }
            }
            catch (error) {
                console.error(error);
                toast.error("Error fetching users");
            }
        };

        fetchAppointments();
    }, [userRole, user]);


    useEffect(() => {
        if (filterStatus === "All Appointments") {
            setFilteredAppointment(appointment);
        } else {
            setFilteredAppointment(appointment.filter(a => a.status === filterStatus));
        }
    }, [filterStatus, appointment]);
    const stats = [
        { label: "Total Appointments", value: totals.total, color: "text-black-600" },
        { label: "Today", value: totals.today, color: "text-emerald-300" },
        { label: "Scheduled", value: totals.scheduled, color: "text-sky-500" },
        { label: "Discharged", value: totals.completed, color: "text-green-600" },
        { label: "Confirmed", value: totals.confirmed, color: "text-indigo-600" },
        { label: "Cancelled", value: totals.cancelled, color: "text-rose-600" },
        { label: "Missed", value: totals.missed, color: "text-orange-500" },
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
                                Appointment Management
                            </h1>
                            <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">
                                Schedule and manage patient appointments
                            </p>
                        </div>
                        {/* to display totals */}
                        {userRole !== "patient" && (
                            
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
                        )}
                        {/* Filter Dropdown */}
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
                                    <option>All Appointments</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Discharged</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="missed">Missed</option>
                                </select>

                                {(userRole === "admin" || userRole === "staff" || userRole === "patient") && (
                                    <NavLink
                                        to={`/${userRole}/appointment/create`}
                                        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-center text-sm"
                                    >
                                        + Book Appointment
                                    </NavLink>
                                )}
                            </div>
                        </div>


                        {/* Table */}
                        <div className="overflow-x-auto bg-white dark:bg-gray-800 
                                        rounded-lg shadow p-2">
                            <AppointTable
                                appointment={filteredAppointment}

                            />
                        </div>
                    </div>

                </div>
            </div>
            </PageWrapper>
        </>
    )
}
export default AppointmentManagement