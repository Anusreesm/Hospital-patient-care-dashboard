import { useEffect, useState } from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Sidebar from "../../Components/Layouts/Sidebar";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import { GetAllAppointment } from "../../api/AppointmentApi";
import { GetAllReg } from "../../api/RegApi";
import { GetAllPatients } from "../../api/PatientApi";
import ProfileForm from "../Common/Profile/ProfileForm";
import { formatToDDMMYYYY } from "../../Utils/dataFormatter";

const DoctorDashboard = () => {
    const { userName, user } = useAuth();
    const [totals, setTotals] = useState({
        todaysAppointment: 0,
        totalPatients: 0,
        weeklyAppointment: 0,
        nextAppointment: 0
    })

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const appointments = await GetAllAppointment();


                let appointDatas = appointments?.data?.appointments || [];


                console.log(appointDatas.map(a => ({
                    patient: a.patient_id?.name,
                    doctorId: a.hosp_staff_id?.user_id?._id,
                    status: a.status,
                    date: a.date
                })));

                const todayStr = new Date().toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata"
                });
                console.log(todayStr)
                // -------------------------------------------------------
                //   1. todays appointments
                const todaysAppointments = appointDatas.filter(a => {
                    const appointDate = new Date(a.date).toLocaleDateString("en-CA", {
                        timeZone: "Asia/Kolkata"
                    });
                    console.log(appointDate, "date")

                    return (
                        a.hosp_staff_id?.user_id?._id === user?.id
                        &&
                        appointDate === todayStr &&
                        ["scheduled", "confirmed"].includes(a.status)
                    );
                });

                // -----------------------------------------------------------------
                // 2. total unique patients under logged-in doctor with confirmed or scheduled appointments
                const doctorAppointments = appointDatas.filter(a =>
                    a.hosp_staff_id?.user_id?._id === user.id &&
                    ["scheduled", "confirmed"].includes(a.status)
                );
                console.log(doctorAppointments, "doctors appointments")
                const patientIds = doctorAppointments.map(a => a.patient_id._id);
                console.log(patientIds, "ids")
                const uniquePatientIds = [...new Set(patientIds)];
                const totalPatientsUnderDoctor = uniquePatientIds.length;

                // ----------------------------------------
                // 3. This week's appointments for logged-in doctor

                const parseAppointmentDateTime = (a) => {
                    const [year, month, day] = a.date.split('T')[0].split('-');
                    const [hour, minute] = a.time.split(':');
                    return new Date(year, month - 1, day, hour, minute);
                };

                const now = new Date();

                // weekly range → today to next 7 days
                const weekAhead = new Date();
                weekAhead.setDate(now.getDate() + 7);
                weekAhead.setHours(23, 59, 59, 999);

                // Weekly appointments:
                const weeklyAppointments = appointDatas
                    .filter(a => a.hosp_staff_id?.user_id?._id === user?.id)
                    .filter(a => ["scheduled", "confirmed"].includes(a.status))
                    .filter(a => {
                        const dt = parseAppointmentDateTime(a);
                        return dt >= now && dt <= weekAhead;
                    })
                    .sort((a, b) => parseAppointmentDateTime(a) - parseAppointmentDateTime(b));


                // --------------------------------------------------------------------
                // 4. next upcoming appointment
                const parseAppointmentDateTimeLatest = (a) => {
                    const [year, month, day] = a.date.split('T')[0].split('-');
                    const [hour, minute] = a.time.split(':');
                    // Create a Date object in IST
                    const date = new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));
                    return date;
                };
                const upcomingAppointments = appointDatas
                    .filter(a => a.hosp_staff_id?.user_id?._id === user?.id)
                    .filter(a => ["scheduled", "confirmed"].includes(a.status))
                    .filter(a => parseAppointmentDateTimeLatest(a) >= now) // only future or remaining today
                    .sort((a, b) => parseAppointmentDateTimeLatest(a) - parseAppointmentDateTimeLatest(b));

                const nextApp = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;
                // const formatDate = (dateStr) => {
                //     // remove the "T00:00:00.000Z" part
                //     return dateStr.split('T')[0];
                // };
                const formatDateTime = (date, time) => {
                    if (!date) return "—";
                    const formattedDate = formatToDDMMYYYY(date);
                    return `${formattedDate}${time ? `, ${time}` : ""}`;
                };
                setTotals({
                    todaysAppointment: todaysAppointments.length,
                    totalPatients: totalPatientsUnderDoctor,
                    weeklyAppointment: weeklyAppointments.length,
                    nextAppointment: nextApp
                          ? `${formatDateTime(nextApp.date)} at ${nextApp.time}`
                        : "No upcoming"
                });

            }
            catch (error) {
                console.log(error);
                toast.error("Error fetching staff");
            }
        }
        if (user?.id) fetchDoctor();
    }, [user?.id]);


    const stats = [
        {
            label: "Today's Appointments",
            value: totals.todaysAppointment,
            color: "text-blue-600 dark:text-blue-600",
            subText: "Scheduled for today"
        },
        {
            label: "Total Patients",
            value: totals.totalPatients,
            color: "text-green-600 dark:text-green-600",
            subText: "active patients under your care"
        },
        {
            label: "This Week's Appointments",
            value: totals.weeklyAppointment,
            color: "text-purple-600 dark:text-purple-600",
            subText: "Appointments scheduled this week"
        },
        {
            label: "Next Appointment",
            value: totals.nextAppointment,
            color: "text-orange-300 dark:text-orange-600",
            subText: "Upcoming scheduled appointment"
        }
    ];


    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
                <Navbar />
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 pt-16 sm:pt-6 space-y-4 sm:space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold mb-4">Welcome back {userName}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Overview of hospital operations.</p>
                    </div>

                    {/* to display totals */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {stats.map((item) => (
                            <div
                                key={item.label}
                                className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                <p className={`mt-2 text-3xl font-bold ${item.color}`}>{item.value}</p>
                                {item.subText && (
                                    <p className="text-xs text-gray-400 mt-1">{item.subText}</p>
                                )}
                            </div>
                        ))}
                    </div>


   <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-10 min-h-[250px]">
                        <ProfileForm />
                    </div>





                </div>
            </div>
        </div>
    );
};
export default DoctorDashboard