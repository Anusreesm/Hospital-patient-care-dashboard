import toast from "react-hot-toast";
import { DeleteDonor, UpdateDonor } from "../../../api/BloodBankDonorApi";
import { verifyComplete, verifyDelete } from "../../../Utils/Alerts/ErrorAlert";

const DonorRow = ({ donor, onUpdate, onEdit, onDelete }) => {
    console.log(donor)

    const handleComplete = async (id) => {
        try {
            const confirmed = await verifyComplete("donation");
            if (!confirmed) return;

            // Pass the correct payload
            const res = await UpdateDonor(id, { status: "COMPLETED" });
            console.log(res, "response after marking complete");

            if (res.success) {
                toast.success("Donor marked as completed!");
                if (onUpdate) onUpdate(); // refresh table
            } else {
                toast.error(res.message || "Failed to mark donor as completed");
            }
        } catch (err) {
            console.error("Error completing Donor:", err);
            toast.error(err.response?.data?.message || "Something went wrong.");

        }
    }


    // delete
    const handleDelete = async (id) => {
        const confirmed = await verifyDelete("donation");
        if (!confirmed) return;
        try {
            const resDonation = await DeleteDonor(id);
            if (resDonation.success) {
                toast.success("Donor deleted successfully!");
                if (onDelete) onDelete(id) // Notify parent to update UI
            } else {
                toast.error(resDonation.message || "Failed to delete appointment");
            }

        }
        catch (error) {
            console.error("Error deleting donation:", error);
            toast.error("Something went wrong while deleting");
        }
    }
    return (
        <>
             <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm">
                {/* donor details */}
                <td className="p-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs sm:text-sm font-semibold uppercase text-gray-700 dark:text-gray-200">
                            {donor?.donor_name?.charAt(0) || ""}
                        </div>
                        <div className="truncate max-w-[110px] sm:max-w-[160px]">
                            <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                                {donor?.donor_name || "—"}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs truncate">
                                {donor?.phone || "—"}
                            </p>
                        </div>
                    </div>
                </td>
                {/* bloodType */}
                <td className="p-3">
                    <span className='text-gray-800 dark:text-gray-200 font-medium text-center sm:text-left'>
                        {donor?.blood_type || "—"}
                    </span>
                </td>
                {/* units in bags */}
                <td className="p-3">
                    <span className='text-gray-800 dark:text-gray-200 font-medium text-center sm:text-left'>
                        {donor?.available_unit || "—"}
                    </span>
                </td>
                {/* date */}
                <td className="p-3">
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-center sm:text-left">
                        {new Date(donor?.date).toLocaleDateString()}
                    </span>
                </td>
                {/* status */}
                <td className="p-3">
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-center sm:text-left">
                        {donor?.status || "—"}
                    </span>
                </td>
                {/* actions */}
                <td className="p-3 text-center">
                    <div className="flex gap-2 justify-center">
                        {/* edit */}

                        {donor.status?.toLowerCase() !== "completed" && (
                            <button
                                title="Edit"
                                onClick={() => onEdit(donor)}
                                className="bg-gray-500 dark:bg-gray-700 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                            >
                                <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                        )}

                        {/* delete */}
                        <button
                            title="Delete"
                            onClick={() => handleDelete(donor._id)}
                            className="bg-gray-500 dark:bg-gray-700 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>

                        {/* mark as complete  */}
                        {donor.status?.toLowerCase() !== "completed" && (
                            <button
                                onClick={() => handleComplete(donor._id)}
                                className="bg-gray-500 dark:bg-gray-700 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                                <i className="fa-solid fa-check"></i>

                            </button>
                        )}
                    </div>

                </td>

            </tr>
        </>
    )
}
export default DonorRow