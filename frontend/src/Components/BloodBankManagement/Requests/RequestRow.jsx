import { useState } from "react";
import { verifyDelete } from "../../../Utils/Alerts/ErrorAlert";
import { DeleteBloodReq } from "../../../api/BloodBankReqApi";
import toast from "react-hot-toast";
import { formatToDDMMYYYY } from "../../../Utils/dataFormatter";

const RequestRow = ({ request, onEdit, onDelete, onStatusUpdate }) => {
    console.log(request)
const formatDateTime = (date, time) => {
        if (!date) return "—";
        const formattedDate = formatToDDMMYYYY(date);
        return `${formattedDate}${time ? `, ${time}` : ""}`;
    };

    const PRIORITY_COLORS = {
        low: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100",
        medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100",
        high: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100",
        critical: "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-100",
    };

    const [localStatus, setLocalStatus] = useState(request.status);

    const handleStatusChange = (value) => {
        // updates only with req id  [id]:value
        setLocalStatus(value);
    };

    // delete
    const handleDelete = async (id) => {
        const confirmed = await verifyDelete("request");
        if (!confirmed) return;
        try {
            const resRequest = await DeleteBloodReq(id);
            if (resRequest.success) {
                toast.success("Request deleted successfully!");
                if (onDelete) onDelete(id) // Notify parent to update UI
            } else {
                toast.error(resRequest.message || "Failed to delete request");
            }

        }
        catch (error) {
            console.error("Error deleting Request:", error);
            toast.error("Something went wrong while deleting");
        }
    }

    const isLocked = request.wasStockDeducted === true;
    return (
        <>
            <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm">
                {/* patient details */}
                <td className="p-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs sm:text-sm font-semibold uppercase text-gray-700 dark:text-gray-200">
                            {request?.appointment_id?.patient_id?.name?.charAt(0) || ""}
                        </div>
                        <div className="truncate max-w-[110px] sm:max-w-[160px]">
                            <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                                {request?.appointment_id?.patient_id?.name || "—"}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs truncate">
                                {request?.appointment_id?.hosp_staff_id?.name || "—"}
                            </p>
                        </div>
                    </div>
                </td>

                {/* bloodType */}
                <td className="p-3">
                    <span className='text-gray-800 dark:text-gray-200 font-medium text-center sm:text-left'>
                        {request?.appointment_id?.patient_id?.bloodType || "—"}
                    </span>
                </td>


                {/* units in bag */}
                <td className="p-3">
                    <span className='text-gray-800 dark:text-gray-200 font-medium text-center sm:text-left'>
                        {request?.units_required || "—"}
                    </span>
                </td>


                {/* urgency */}
                <td className="p-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium 
      ${PRIORITY_COLORS[request?.priority?.toLowerCase()] ||
                            "bg-gray-200 text-gray-700"}`}
                    >
                        {request?.priority || "—"}
                    </span>
                </td>


                {/* date */}
                <td className="p-3">
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-center sm:text-left">
                        {/* {new Date(request?.request_date).toLocaleDateString()} */}
                         {formatDateTime(request?.request_date)}                   
                          </span>
                </td>

                {/* status */}
                <td className="p-3">
                    <select
                        value={localStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={isLocked}
                        className="border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-700 
                                               text-gray-800 dark:text-gray-300
                                               rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>

                    </select>
                </td>
                {/* actions */}
                <td className="p-3 text-center">
                    <div className="flex gap-2  items-center">
                        {/* update */}
                        {!isLocked && (
                            <button
                                onClick={() => onStatusUpdate(request._id, localStatus)}
                                className="bg-gray-500 dark:bg-gray-700 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                                <i className="fa-solid fa-check"></i>
                            </button>
                        )}
                        {/* edit */}
                        {!isLocked && (

                            <button
                                title="Edit"
                                onClick={() => onEdit(request)}
                                className="bg-gray-500 dark:bg-gray-700 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                            >
                                <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                        )}
                        {/* delete */}
                        <button
                            title="Delete"
                            onClick={() => handleDelete(request._id)}
                            className="bg-gray-500 dark:bg-gray-700 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </>
    )
}
export default RequestRow