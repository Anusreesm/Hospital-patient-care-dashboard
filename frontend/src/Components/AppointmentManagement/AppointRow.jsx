import toast from "react-hot-toast";
import { CompleteAppointment, DeleteAppointment } from "../../api/AppointmentApi";
import { verifyComplete, verifyDelete } from "../../Utils/Alerts/ErrorAlert";
import { useAuth } from "../../Context/AuthContext";
import { formatToDDMMYYYY } from "../../Utils/dataFormatter";
const STATUS_COLORS = {
    scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    confirmed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
    completed: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100",
    missed: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
};

const AppointRow = ({ appointment, onUpdate, onEdit, onDelete }) => {
    console.log(appointment)
    const { userRole } = useAuth()
    const formatDateTime = (date, time) => {
        if (!date) return "—";
    const formattedDate = formatToDDMMYYYY(date);
    return `${formattedDate}${time ? `, ${time}` : ""}`;
};

    const mergeDateAndTime = (isoDate, time) => {
        if (!isoDate || !time) return null;

        const datePart = isoDate.split("T")[0]; // "2025-11-24"

        const [hours, minutes] = time.split(":");

        return new Date(`${datePart}T${hours}:${minutes}:00`);
    };
    // Create combined appointment Date+Time
    const appointmentDateTime = mergeDateAndTime(appointment.date, appointment.time);
    const now = new Date();

    // Enable discharge ONLY IF:
    // - appointment is confirmed
    // - payment is paid
    // - current time >= appointment time
    const canDischarge =
        appointment.status === "confirmed" &&
        appointment.payment_id?.status === "paid" &&
        appointmentDateTime instanceof Date &&
        !isNaN(appointmentDateTime) &&
        now >= appointmentDateTime;

    console.log("Raw:", appointment.date, appointment.time);
    console.log("Final Date object:", appointmentDateTime);
    console.log("Now:", now);

    // update
    const handleComplete = async (id) => {
        try {
            // Block discharge before appointment time
            if (!canDischarge) {
                toast.error("Patient has not yet attended the appointment.");
                return;
            }
            const confirmed = await verifyComplete("patient discharge");
            if (!confirmed) return;
            const res = await CompleteAppointment(id);
            console.log(res, "response")
            if (res.success) {
                toast.success("Patient discharged successfully!");
                if (onUpdate) onUpdate(); // refresh table
            }
        } catch (err) {
            console.error("Error completing appointment:", err);
            toast.error(err.response?.data?.message || "Something went wrong.");

        }
    };
    const handleDelete = async (id) => {
        // Allow only certain statuses to be deleted
        if (!["scheduled", "confirmed", "missed", "cancelled"].includes(appointment.status)) {
            toast.error("Only scheduled, confirmed, missed or cancelled appointments can be deleted");
            return;
        }

        // SweetAlert2 confirmation
        const confirmed = await verifyDelete("appointment");
        if (!confirmed) return;

        try {
            const res = await DeleteAppointment(id);

            if (res.success) {
                toast.success("Appointment deleted successfully!");
                if (onDelete) onDelete(id); // Notify parent to update UI
            } else {
                toast.error(res.message || "Failed to delete appointment");
            }
        } catch (error) {
            console.error("Error deleting appointment:", error);
            toast.error("Something went wrong while deleting");
        }
    };


    // Button enable/disable condition
    const isButtonEnabled =
        appointment.status === "confirmed" &&
        appointment.payment_id?.status === "paid";
    return (
        <>

            <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm">
                {/*  Patient info (name + email) */}
                <td className="py-3 align-middle">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs sm:text-sm font-semibold uppercase text-gray-700 dark:text-gray-200">
                            {appointment?.patient_id?.name?.charAt(0) || ""}
                        </div>
                        <div className="truncate max-w-[110px] sm:max-w-[160px]">
                            <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                                {appointment?.patient_id?.name || "—"}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs truncate">
                                {appointment?.patient_id?.user_id?.email || "—"}
                            </p>
                        </div>
                    </div>
                </td>

                {/*  Doctor info (name + specialization) */}
                <td className="py-3 align-middle">
                    <div className="truncate max-w-[110px] sm:max-w-[160px]">
                        <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                            {appointment?.hosp_staff_id?.name || "—"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs truncate">
                            {appointment?.specialization_id?.spec_name || "—"}
                        </p>
                    </div>
                </td>

                {/*  Date & Time */}
                <td className="py-3 align-middle">
                    <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                        {formatDateTime(appointment?.date, appointment?.time)}
                    </p>
                </td>

                {/*  Status  */}
                <td className="py-3 align-middle">
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[appointment?.status] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                    >
                        {appointment?.status || "—"}
                    </span>
                </td>


                {/*  Fees (payment status + amount) */}
                <td className="py-3 align-middle">
                    <div className="flex flex-col items-start space-y-1">
                        <p className="font-medium text-gray-800 dark:text-gray-100 text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">
                            ₹{appointment?.amount || 0}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs truncate">
                            {appointment?.payment_id?.status || ""}

                        </p>

                    </div>
                </td>


                {/*  Token number */}
                <td className="py-3 align-middle text-gray-800 dark:text-gray-100 font-medium text-center sm:text-left">
                    {appointment?.token_no || "—"}
                </td>
                {/* actions-delete and update */}
                <td className="py-3 pr-6 text-right align-middle whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-2">
                        {/* edit button */}
                        <button
                            title="Edit"
                            onClick={() => {
                                if (["confirmed", "completed", "cancelled", "missed"].includes(appointment.status)) {
                                    toast.error("You can’t edit a confirmed, completed, cancelled, or missed appointment");
                                    return;
                                }
                                if (onEdit) onEdit(appointment);
                            }}
                            className={`p-2 rounded-md text-gray-700 hover:bg-yellow-300 dark:text-gray-200 transition ${["confirmed", "completed", "cancelled", "missed"].includes(appointment.status)
                                ? "bg-gray-200 dark:bg-gray-700 opacity-50"
                                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        {/* delete button */}

                        <button
                            title="Delete"
                            onClick={() => handleDelete(appointment._id)}
                            disabled={!["scheduled", "confirmed", "missed", "cancelled"].includes(appointment.status)}
                            className={`p-2 rounded-md text-red-600 hover:bg-red-300 dark:text-red-400 transition ${["scheduled", "confirmed", "missed"].includes(appointment.status)
                                ? "bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-700"
                                : "bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-50"
                                }`}
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>



                        {/* mark as complete button */}
                        {(userRole === "admin" || userRole === "staff" || userRole === "doctor") && (
                            <button
                                onClick={() => handleComplete(appointment._id)}
                                disabled={
                                    appointment.status === "completed" || !isButtonEnabled
                                }
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${appointment.status === "completed"
                                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white"
                                    : isButtonEnabled
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-white"
                                    }`}
                            >
                                {appointment.status === "Discharged" ? "Completed" : "Discharge"}
                            </button>
                        )}
                    </div>
                </td>

            </tr>
        </>
    )
}
export default AppointRow