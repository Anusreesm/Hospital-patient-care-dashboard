import { useEffect, useState } from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Sidebar from "../../Components/Layouts/Sidebar";
import { useAuth } from "../../Context/AuthContext";
import { GetAllAppointment } from "../../api/AppointmentApi";
import { GetAllPayments } from "../../api/PaymentApi";
import ProfileForm from "../Common/Profile/ProfileForm";

const PatientDashboard = () => {
    const { userName, user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    useEffect(() => {
        fetchAppointments();
        fetchPayments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        const res = await GetAllAppointment();

        if (res.success) {
            setAppointments(res.data.appointments);
        }
        setLoading(false);
    };

    const fetchPayments = async () => {
        setLoading(true);
        const res = await GetAllPayments();
        if (res.success) {
            setPayments(res.data.payment);
        }
        setLoading(false);
    }

    // Filter appointments only for logged-in patient
    const patientAppointments = appointments.filter(
        a => a.patient_id?.user_id?._id === user?.id

    );
    console.log(patientAppointments)


    // const upcomingAppointments = patientAppointments
    //   .filter(a => ["scheduled", "confirmed"].includes(a.status))
    //   .filter(a => {
    //       // Split date parts
    //       const [year, month, day] = a.date.split('T')[0].split('-');
    //       const [hour, minute] = a.time.split(':');

    //       // Create local date
    //       const appointmentDateTime = new Date(year, month - 1, day, hour, minute);
    //       return appointmentDateTime > new Date();
    //   })
    //   .sort((a, b) => {
    //       const [y1, m1, d1] = a.date.split('T')[0].split('-');
    //       const [h1, min1] = a.time.split(':');
    //       const dt1 = new Date(y1, m1 - 1, d1, h1, min1);

    //       const [y2, m2, d2] = b.date.split('T')[0].split('-');
    //       const [h2, min2] = b.time.split(':');
    //       const dt2 = new Date(y2, m2 - 1, d2, h2, min2);

    //       return dt1 - dt2;
    //   })
    //   .slice(0, 3);




    const parseAppointmentDateTime = (a) => {
        const [year, month, day] = a.date.split('T')[0].split('-');
        const [hour, minute] = a.time.split(':');
        return new Date(year, month - 1, day, hour, minute);
    };

    const upcomingAppointments = patientAppointments
        .filter(a => ["scheduled", "confirmed"].includes(a.status))
        .filter(a => parseAppointmentDateTime(a) > new Date())
        .sort((a, b) => parseAppointmentDateTime(a) - parseAppointmentDateTime(b))
        .slice(0, 3);

    console.log(user, "details")




    // Filter payments only for logged-in patient
    const patientAppointmentIds = patientAppointments.map(a => a._id);

    // Filter payments for these appointments
    const patientPayments = payments.filter(
        p => patientAppointmentIds.includes(p.appointment_id)
    );

    console.log(patientPayments, "payment")

    // Outstanding balance = sum of pending payments
    const outstandingBalance = patientPayments
        .filter(p => p.status === "pending")
        .reduce((sum, p) => sum + p.amount, 0);

    // Paid payments for last payment / total paid
    const paidPayments = patientPayments.filter(p => p.status === "paid");
    const lastPaymentAmount = paidPayments.length
        ? paidPayments[paidPayments.length - 1].amount
        : 0;
    const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
                <Navbar />
                <div className="p-6">
                    <h1 className="text-2xl font-semibold mb-4">Welcome back {userName}</h1>
                    <p className="dark:text-gray-400">Overview of hospital operations.</p>



                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-6">

                        {/* UPCOMING APPOINTMENTS CARD */}
                        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-5 shadow">
                            <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>

                            {loading ? (
                                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                            ) : upcomingAppointments.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400">No upcoming appointments</p>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingAppointments.map((app) => (
                                        <div
                                            key={app._id}
                                            className="pb-3 border-b border-gray-200 dark:border-gray-700"
                                        >
                                            <p className="font-medium">
                                                {app.hosp_staff_id?.name || "Unknown Doctor"}
                                            </p>

                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(app.date).toLocaleDateString()} — {app.time}
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                Token: {app.token_no}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PAYMENT STATUS CARD */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                            <h2 className="text-lg font-semibold mb-3">Payment Status</h2>
                            <div className="space-y-3">
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                                    <p className="font-medium">
                                        Outstanding Balance: ₹{outstandingBalance}
                                    </p>
                                    <p className="text-sm dark:text-gray-400">
                                        Last Payment: ₹{lastPaymentAmount} / Total Paid: ₹{totalPaid}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>



                    {/* =============== BOTTOM SECTION (EMPTY FULL WIDTH) =============== */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-10 min-h-[250px]">
                        <ProfileForm />
                    </div>


                </div>
            </div>
        </div>
    );
};























export default PatientDashboard