import { useEffect, useState } from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Sidebar from "../../Components/Layouts/Sidebar";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import { GetAllAppointment } from "../../api/AppointmentApi";
import { GetAllBloodReq } from "../../api/BloodBankReqApi";
import { GetAllDonors } from "../../api/BloodBankDonorApi";
import { GetAllPayments } from "../../api/PaymentApi";
import ProfileForm from "../Common/Profile/ProfileForm";

const StaffDashboard = () => {
    const { userName } = useAuth();
    const [totals, setTotals] = useState({
        todaysAppointment: 0,
        pendingBloodReq: 0,
        todaysDonation: 0,
        todaysCollection: 0,
        pendingPayment: 0
    })
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const appointments = await GetAllAppointment();
                const bloodReq = await GetAllBloodReq();
                const bloodDonation = await GetAllDonors();
                const payment = await GetAllPayments();

                let appointDatas = appointments?.data?.appointments || [];
                let bloodReqDatas = bloodReq?.data?.bloodBankReq || [];
                let bloodDonationDatas = bloodDonation?.data?.bloodBank || [];
                let paymentDatas = payment?.data?.payment || [];

                // 1. todays appointments
                const todayStr = new Date().toISOString().split("T")[0];
                const appoint = appointDatas.filter((a) => {
                    const appointDate = new Date(a.date).toISOString().split("T")[0];
                    return appointDate === todayStr && ["scheduled", "confirmed"].includes(a.status);
                })

                // 2. blood bank req
                const bloodReqs = bloodReqDatas.filter((r) =>
                    !["rejected", "approved"].includes(r.status)
                );
                // 3. todays scheduled donation
                const donation = bloodDonationDatas.filter((d) => {
                    const DonationDate = new Date(d.date).toISOString().split("T")[0];
                    return DonationDate === todayStr && d.status?.toLowerCase() === "scheduled";
                });

                // 4. today's total collection AMOUNT
                const todayCollectionAmount = paymentDatas
                    .filter((p) => {
                        const paymentDate = new Date(p.createdAt).toISOString().split("T")[0];
                        return paymentDate === todayStr && p.status?.toLowerCase() === "paid";
                    })
                    .reduce((sum, p) => sum + (p.amount || 0), 0);

                // 5. total pending AMOUNT
                // const pendingPaymentAmount = paymentDatas
                //     .filter((p) => p.status?.toLowerCase() === "pending")
                //     .reduce((sum, p) => sum + (p.amount || 0), 0);

let pendingPaymentAmount = 0;
try {
    pendingPaymentAmount = paymentDatas
        .filter(p => {
            const isPending = p.status?.toLowerCase() === "pending";
            const appointment = appointDatas.find(a =>
                a._id && p.appointment_id && a._id.toString() === p.appointment_id.toString()
            );
           
            const validAppointment = appointment && !["missed", "deleted"].includes(appointment.status?.trim().toLowerCase());
            return isPending && validAppointment;
        })
        .reduce((sum, p) => sum + (p.amount || 0), 0);
} catch (err) {
    console.error("Pending payment calculation error:", err);
}


                setTotals({
                    todaysAppoint: appoint.length,
                    pendingBloodReq: bloodReqs.length,
                    todaysDonation: donation.length,
                    todaysCollection: todayCollectionAmount,   // Amount
                    pendingPayment: pendingPaymentAmount       // Amount
                });


            }
            catch (error) {
                console.log(error);
                toast.error("Error fetching staff");
            }

        }
        fetchStaff();

    }, [])

    const stats = [
        {
            label: "Today's Appointments",
            value: totals.todaysAppoint,
            color: "text-yellow-300 dark:text-yellow-300",
            subText: "Scheduled for today"
        },
        {
            label: "Pending Blood Requests",
            value: totals.pendingBloodReq,
            color: "text-red-600 dark:text-red-600",
            subText: "Awaiting approval"
        },
        {
            label: "Today's Donations",
            value: totals.todaysDonation,
            color: "text-green-600 dark:text-green-600",
            subText: "Scheduled donors for today"
        },
        {
            label: "Today's Collection",
            value: `₹${totals.todaysCollection}`,
            color: "text-blue-600 dark:text-blue-600",
            subText: "Amount collected today"
        },
        {
            label: "Pending Payment Amount",
            value: `₹${totals.pendingPayment}`,
            color: "text-orange-600 dark:text-orange-600",
            subText: "Awaiting clearance"
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
                        <p className="text-gray-500  dark:text-gray-400 text-sm sm:text-base">Overview of hospital operations.</p>
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
export default StaffDashboard