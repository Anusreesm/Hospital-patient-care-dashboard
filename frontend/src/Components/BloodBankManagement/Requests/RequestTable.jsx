import { useEffect, useState } from "react"
import { GetAllBloodReq, UpdateBloodReq } from "../../../api/BloodBankReqApi";
import toast from "react-hot-toast";
import RequestRow from "./RequestRow";
import CreateRequest from "../../../Pages/Common/BloodBankManagement/Requests/createRequest";
import { verifyComplete } from "../../../Utils/Alerts/ErrorAlert";
import PageWrapper from "../../pageWrappers";

const RequestTable = ({ request = [] }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null)
    const [requests, setRequests] = useState([])
     

    // to get all requests
    const fetchRequests = async () => {
        try {
            const res = await GetAllBloodReq()
            console.log("API response:", res.data);
            if (Array.isArray(res?.data?.bloodBankReq)) {
                setRequests(res.data.bloodBankReq);
            } else {
                toast.error("Unexpected data format");
                setRequests([]);
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Error fetching bloodbank req");
            setRequests([])
        }
    }
    useEffect(() => {
        fetchRequests();
    }, []);

    // Sync filtered data from parent component
    useEffect(() => {
        if (request?.length) {
            setRequests(request);
        } else {
            setRequests([]);
        }
    }, [request]);
    //  handle delete
    const handleDelete = (deletedId) => {
        setRequests((prev) => prev.filter((r) => r._id !== deletedId));
    };
    // handle edit
    const handleEdit = (reqData) => {
        setSelectedReq(reqData);
        setShowModal(true);
    };
    // called when req updated -refresh
    const handleUpdateSuccess = async () => {
        await fetchRequests(); // Re-fetch latest data after update

    };

     const handleComplete = async (id, newStatus) => {
       if (!newStatus) {
            toast.error("Please select a status first");
            return;
        }
         const confirmed = await verifyComplete("request");
    if (!confirmed) return;
        try {
            // api-update status
            const res = await UpdateBloodReq( id,{ status: newStatus });
            if (res.success) {
                // update the request list in state to reflect the new status
                setRequests((prev) =>
                    prev.map((r) =>
                        r._id === id ? { ...r, status: newStatus } : r
                    )
                );
                toast.success(`User status updated to ${newStatus}`);
            } else {
                toast.error(res.message || "Failed to update status");
            }
        } catch (err) {
            console.error("Status update error:", err);
            toast.error("Error updating status");
        }
    };
    return (
        <>
        <PageWrapper>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-3 sm:p-4 w-full">

                <h2 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">Request List ({requests.length})</h2>
                <div className="overflow-x-auto">
                    {requests.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                                    <th className="p-3 text-left">Patient</th>
                                    <th className="p-3 text-left">Blood Type</th>
                                    <th className="p-3 text-left">Units(in bags)</th>
                                    <th className="p-3 text-left">Urgency</th>
                                    <th className="p-3 text-left">Date</th>
                                    <th className="p-3 text-left">status</th>
                                    <th className="p-3 text-left">Actions</th>

                                </tr>
                            </thead>
                            <tbody className="text-gray-800 dark:text-gray-200">
                                {
                                    requests.map((r) => (
                                        <RequestRow
                                            key={r._id}
                                            request={r}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            onStatusUpdate={handleComplete}

                                        />

                                    ))}
                            </tbody>


                        </table>
                    ) : (<p className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No Request found.
                    </p>
                    )}
                </div>

                {showModal && selectedReq && (
                    <CreateRequest
                        mode="update"
                        existingReq={selectedReq}
                        onClose={(updated) => {
                            setShowModal(false);
                            if (updated) handleUpdateSuccess();
                        }}
                        onRefresh={fetchRequests}
                    />
                )}





            </div>
            </PageWrapper>
        </>
    )
}
export default RequestTable