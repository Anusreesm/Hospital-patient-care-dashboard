import { useEffect, useState } from "react";
import Navbar from "../../Components/Layouts/Navbar";
import Sidebar from "../../Components/Layouts/Sidebar";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import { GetAllPatients } from "../../api/PatientApi";
import { GetAllAppointment } from "../../api/AppointmentApi";
import { GetAllHospStaff } from "../../api/HospStaff";
import { GetAllPayments } from "../../api/PaymentApi";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";
import PageWrapper from "../../Components/pageWrappers";

const AdminDashboard = () => {
    const { userName } = useAuth();
    const [totals, setTotals] = useState({
        totalPatients: 0,
        todaysAppoint: 0,
        activeDoctors: 0,
        pendingPayment: 0,
        revenueMonthly: 0
    })
    const [pieChartData, setPieChartData] = useState([]);
    const [deptPieChartData, setDeptPieChartData] = useState([]);
    const [revenueTrendData, setRevenueTrendData] = useState([]);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DD0", "#FF6699", "#33CC33"];

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const patients = await GetAllPatients();
                const appointments = await GetAllAppointment();
                const staff = await GetAllHospStaff();
                const payment = await GetAllPayments();


                let patientDatas = patients?.data?.patient || [];
                let appointDatas = appointments?.data?.appointments || [];
                let staffDatas = staff?.data?.staffs || [];
                let paymentDatas = payment?.data?.payment || [];

                // 1. total active patients
                const totalPat = patientDatas.length;
                // 2. total todays appointments
                const todayStr = new Date().toISOString().split("T")[0];
                const appoint = appointDatas.filter((a) => {
                    const appointDate = new Date(a.date).toISOString().split("T")[0];
                    return appointDate === todayStr && ["scheduled", "confirmed"].includes(a.status);
                })
                //   3. total active doctors
                const doc = staffDatas.filter((s) =>
                    s.dept_id?.dept_name?.toLowerCase() === "doctor" && s.isActive
                );

                // 4. pending payments
                const pendingPayments = paymentDatas.filter(p => p.status === "pending")

                // 5. monthly revenue-collected this month
                // Get current month and year
                const now = new Date();
                const currentMonth = now.getMonth(); // 0-11
                const currentYear = now.getFullYear();

                // Filter paid payments for this month
                const monthlyPayments = paymentDatas.filter(p => {
                    const payDate = new Date(p.createdAt);
                    return p.status === "paid" &&
                        payDate.getMonth() === currentMonth &&
                        payDate.getFullYear() === currentYear;
                });

                // Sum amounts
                const revenueMonthly = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

                setTotals({
                    totalPatients: totalPat,
                    todaysAppoint: appoint.length,
                    activeDoctors: doc.length,
                    pendingPayment: pendingPayments.length,
                    revenueMonthly: revenueMonthly

                })
                // Doctor specialization pie chart
                const specializationCount = doc.reduce((acc, doctor) => {
                    const spec = doctor.specialization_id?.spec_name || "Not Assigned";
                    acc[spec] = (acc[spec] || 0) + 1;
                    return acc;
                }, {});

                const pieData = Object.keys(specializationCount).map(spec => ({
                    name: spec,
                    value: specializationCount[spec]
                }));

                setPieChartData(pieData);
                // Department-wise staff pie chart
                const deptCount = staffDatas.reduce((acc, staff) => {
                    const dept = staff.dept_id?.dept_name || "Not Assigned";
                    acc[dept] = (acc[dept] || 0) + 1;
                    return acc;
                }, {});


                const deptPieData = Object.keys(deptCount).map((dept) => ({
                    name: dept,
                    value: deptCount[dept]
                }));

                setDeptPieChartData(deptPieData);

                // Revenue trend (monthly)
                const trendData = Array.from({ length: 12 }, (_, i) => {
                    const monthPayments = paymentDatas.filter((p) => {
                        const payDate = new Date(p.createdAt);
                        return p.status === "paid" &&
                            payDate.getMonth() === i &&
                            payDate.getFullYear() === currentYear;
                    });
                    const revenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
                    return { month: new Date(0, i).toLocaleString("default", { month: "short" }), revenue };
                });
                setRevenueTrendData(trendData);

            }
            catch (error) {
                console.log(error);
                toast.error("Error fetching admin");
            }

        }
        fetchAdmin();
    }, [])

    const stats = [
        {
            label: "Total Patients",
            value: totals.totalPatients,
            color: "text-black-600",
            subText: "Total registered patients(active)"
        },
        {
            label: "Today's Appointments",
            value: totals.todaysAppoint,
            color: "text-yellow-300",
            subText: "Scheduled for today"
        },
        {
            label: "Active Doctors",
            value: totals.activeDoctors,
            color: "text-red-600",
            subText: "Currently on duty"
        },
        {
            label: "Pending Payments",
            value: totals.pendingPayment,
            color: "text-orange-600",
            subText: "Awaiting clearance"
        },
        {
            label: "Monthly Revenue",
            value: totals.revenueMonthly,
            color: "text-blue-600",
            subText: "Collected this month"
        }
    ];

    return (
        <PageWrapper className="flex">

            <Sidebar />
            {/* header */}

            <div className="flex-1 min-h-screen">

                <Navbar />

                <div className="flex-1 overflow-y-auto p-3 sm:p-6 pt-16 sm:pt-6 space-y-4 sm:space-y-6 min-h-[calc(100vh-64px)]">

                    <div>
                        <h1 className="text-2xl font-semibold mb-4">
                            Welcome back {userName}
                        </h1>
                        {/* <p className="text-gray-500 text-sm sm:text-base"> */}
                        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">

                            Overview of hospital operations.
                        </p>
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


                    {/* Charts in one row */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Doctor Distribution */}
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Doctor Distribution by Specialization</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        label
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Department-wise Staff */}
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Department-wise Staff Count</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={deptPieChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#82ca9d"
                                        label
                                    >
                                        {deptPieChartData.map((entry, index) => (
                                            <Cell key={`cell-dept-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Revenue Trend */}
                        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Monthly Revenue Trend</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>



        </PageWrapper>
    );
};
export default AdminDashboard