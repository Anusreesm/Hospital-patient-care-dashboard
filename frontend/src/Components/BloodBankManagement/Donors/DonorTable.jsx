import { useEffect, useState } from "react";
import { GetAllDonors } from "../../../api/BloodBankDonorApi";
import toast from "react-hot-toast";
import DonorRow from "./DonorRow";
import CreateDonation from "../../../Pages/Common/BloodBankManagement/Donation/createDonation";
import PageWrapper from "../../pageWrappers";

const DonorTable = ({ donor = [] }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [donors, setDonors] = useState([]);


    //   to get all donors
    const fetchDonors = async () => {
        try {
            const res = await GetAllDonors()
            console.log("API response:", res.data);
            if (Array.isArray(res?.data?.bloodBank)) {
                setDonors(res.data.bloodBank);
            } else {
                toast.error("Unexpected data format");
                setDonors([]);
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Error fetching donors");
            setDonors([])
        }
    };
    useEffect(() => {
        fetchDonors();
    }, []);

    // Sync filtered data from parent component
    useEffect(() => {
        if (donor?.length) {
            setDonors(donor);
        } else {
            setDonors([]);
        }
    }, [donor]);
    //  handle delete
    const handleDelete = (deletedId) => {
        setDonors((prev) => prev.filter((d) => d._id !== deletedId));
    };
    // handle edit
    const handleEdit = (donorData) => {
        setSelectedDonor(donorData);
        setShowModal(true);
    };
    // Called when donors updated successfully
    const handleUpdateSuccess = async () => {
        await fetchDonors(); // Re-fetch latest data after update

    };

    return (
        <>
        <PageWrapper>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-3 sm:p-4 w-full">
                <h2 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">Donor List ({donors.length})</h2>

                <div className="overflow-x-auto">
                    {donors.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                                    <th className="p-3 text-left">Donor</th>
                                    {/* <th className="p-3 text-left">Phone</th> */}
                                    <th className="p-3 text-left">Blood Type</th>
                                    <th className="p-3 text-left">Units(in bags)</th>
                                    <th className="p-3 text-left">Date</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="text-gray-800 dark:text-gray-200">

                                {
                                    donors.map((d) => (
                                        <DonorRow
                                            key={d._id}
                                            donor={d}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            onUpdate={fetchDonors}

                                        />

                                    ))}



                            </tbody>
                        </table>
                    ) : (<p className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No Donors found.
                    </p>
                    )}
                </div>
                {showModal && selectedDonor && (
                    <CreateDonation
                        mode="update"
                        existingDonor={selectedDonor}
                        onClose={(updated) => {
                            setShowModal(false);
                            if (updated) handleUpdateSuccess();
                        }}
                        onRefresh={fetchDonors}
                    />
                )}
            </div>
            </PageWrapper>
        </>
    )
}
export default DonorTable