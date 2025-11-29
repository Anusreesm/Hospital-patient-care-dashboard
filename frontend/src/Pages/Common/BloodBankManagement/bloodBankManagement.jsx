import { useEffect, useState } from "react"
import Navbar from "../../../Components/Layouts/Navbar"
import Sidebar from "../../../Components/Layouts/Sidebar"
import toast from "react-hot-toast"
import { GetAllBloodType } from "../../../api/BloodBankApi"
import { GetAllDonors } from "../../../api/BloodBankDonorApi"
import { GetAllBloodReq } from "../../../api/BloodBankReqApi"
import InventoryTab from "./tabs/InventoryTab"
import DonationTab from "./tabs/DonationTab"
import RequestTab from "./tabs/RequestTab"
import DonorTable from "../../../Components/BloodBankManagement/Donors/DonorTable"

const BloodBankManagement = () => {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem("activeTab") || "inventory";
    });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTab", tab);
    };

    const [bloodMaster, setBloodBankMaster] = useState([]);
    const [bloodDonors, setBloodBankDonors] = useState([]);
    const [bloodRequests, setBloodBankRequests] = useState([]);
    const [totals, setTotals] = useState({
        total: 0,
        expiringSoon: 0,
        criticalTypes: 0,
        pendingReq: 0,
        todaysDonation: 0
    })
    useEffect(() => {
        // setTotals
        const fetchBloodBanks = async () => {
            try {
                const master = await GetAllBloodType();
                const donor = await GetAllDonors();
                const requests = await GetAllBloodReq();

                let bloodBankMaster = master?.data?.bloodBank || [];
                let bloodBankDonors = donor?.data?.bloodBank || [];
                let bloodBankRequest = requests?.data?.bloodBankReq || [];

                setBloodBankMaster(bloodBankMaster);
                setBloodBankDonors(bloodBankDonors);
                setBloodBankRequests(bloodBankRequest);

                // total bags sum 
                const totalUnits = bloodBankMaster.reduce((sum, b) => sum + (b.available_unit || 0), 0);
                //   less than 30 and greater than 10 bags length
                const expiring = bloodBankMaster.filter((b) => b.available_unit < 30 && b.available_unit > 10);
                //    less than or equal to 10 bags length
                const critical = bloodBankMaster.filter((b) => b.available_unit <= 10)
                // pending requests number
                const pending = bloodBankRequest.filter(b => b.status === "pending");
                //    todays donation
                const todayStr = new Date().toISOString().split("T")[0];
                const donation = bloodBankDonors.filter((b) => {
                    const donorDate = new Date(b.date).toISOString().split("T")[0];
                    return donorDate === todayStr && b.status === "COMPLETED";
                });

                setTotals({
                    total: totalUnits,
                    expiringSoon: expiring.length,
                    criticalTypes: critical.length,
                    pendingReq: pending.length,
                    todaysDonation: donation.length
                })


            } catch (error) {
                console.log(error);
                toast.error("Error fetching users");
            }

        }
        fetchBloodBanks();
    }, [])
    const stats = [
        {
            label: "Total Units",
            value: totals.total,
            color: "text-black-600",
            subText: "in bags"
        },
        {
            label: "Expiring Soon",
            value: totals.expiringSoon,
            color: "text-yellow-300",
            subText: "types between 10–30 units"
        },
        {
            label: "Critical Types",
            value: totals.criticalTypes,
            color: "text-red-600",
            subText: "Need immediate attention"
        },
        {
            label: "Pending Requests",
            value: totals.pendingReq,
            color: "text-orange-600",
            subText: "Awaiting approval"
        },
        {
            label: "Today's Donation",
            value: totals.todaysDonation,
            color: "text-blue-600",
            subText: "completed today"
        },
    ];





    return (
        <>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    {/* <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6"> */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-6 pt-16 sm:pt-6 space-y-4 sm:space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                                Blood Bank Management
                            </h1>
                            <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">
                                Manage blood inventory, requests, and donations
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
                        {/* TAB BUTTONS */}
                        {/* TABS */}
                        <div className="flex gap-4 border-b pb-2">
                            <button onClick={() => handleTabChange("inventory")} className={activeTab === "inventory" ? "font-bold text-red-600" : ""}>Inventory</button>

                            <button onClick={() => handleTabChange("donations")} className={activeTab === "donations" ? "font-bold text-red-600" : ""}>Donations</button>

                            <button onClick={() => handleTabChange("requests")} className={activeTab === "requests" ? "font-bold text-red-600" : ""}>Requests</button>

                        </div>

                        {/* TAB CONTENT */}
                        {activeTab === "inventory" && <InventoryTab data={bloodMaster} />}
                        {activeTab === "donations" && <DonationTab donations={bloodDonors} />}
                        {activeTab === "requests" && <RequestTab requests={bloodRequests} />}



                     
                    </div>
                </div>
            </div>
        </>
    )
}
export default BloodBankManagement