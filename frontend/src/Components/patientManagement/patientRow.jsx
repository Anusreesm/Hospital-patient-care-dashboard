import toast from "react-hot-toast";
import { verifyDelete } from "../../Utils/Alerts/ErrorAlert";
import { deletePatient, GetAllPatients } from "../../api/PatientApi";
import { formatToDDMMYYYY } from "../../Utils/dataFormatter";
const STATUS_COLORS = {
    active: "bg-green-400 text-white dark:bg-green-400 dark:text-black",
    discharged: "bg-orange-400 text-white dark:bg-orange-400 dark:text-black",
    deleted: "bg-red-400 text-white dark:bg-red-400 dark:text-black",
}
const PatientRow = ({ patient, nextAppointment, onEdit, onDelete }) => {

    console.log(patient?.patient_id)


   // const formatDate = (date) => {
    //     if (!date) return "-";
    //     const d = new Date(date)
    //     if (isNaN(d)) return "-";
    //     const formattedDate = d.toLocaleDateString("en-GB", {
    //         day: "2-digit",
    //         month: "short",
    //         year: "numeric",
    //         timeZone: "Asia/Kolkata"
    //     })
    //     return `${formattedDate}`
    // }

    const formatDateTime = (date, time) => {
        if (!date) return "—";
        const formattedDate = formatToDDMMYYYY(date);
        return `${formattedDate}${time ? `, ${time}` : ""}`;
    };
    const nextDate = nextAppointment(patient._id);

    //     const handleDelete = async (patientId) => {
    //         const confirmed = await verifyDelete("patient");
    //         if (!confirmed) return;

    //         try {
    //             const patientList = await GetAllPatients();
    //             const patientArray = patientList?.data?.patient;
    //          console.log(JSON.stringify(patientArray[0], null, 2),"test");

    //          const patientToDelete = patientArray.find(
    //     (p) => p._id === patientId
    // );



    //             console.log(patientToDelete, "patient delete")
    //             if (!patientToDelete) {
    //                 toast.error("Unable to delete patient");
    //                 return;
    //             }

    //             const res = await deletePatient(patientToDelete._id);

    //             if (res?.success) {
    //                 toast.success("Patient deleted successfully");
    //                 onDelete?.(patientId);
    //             } else {
    //                 toast.error("Failed to delete patient");
    //             }
    //         } catch (err) {
    //             toast.error("Error deleting patient");
    //             console.error(err);
    //         }
    //     };

   const handleDelete = async (patientId) => {
    const confirmed = await verifyDelete("patient");
    if (!confirmed) return;

 
    console.log("Deleting patient:", patientId);

    const res = await deletePatient(patientId);

    if (res.success) {
        toast.success("Patient deleted!");
        onDelete?.(patientId);
    } else {
       toast.error(res.message || "Unable to delete patient.");
    }
};

    return (
        <>
            <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm">
                {/* patient name  */}
                <td className="py-3 align-middle">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs sm:text-sm font-semibold uppercase text-gray-700 dark:text-gray-200">
                            {patient?.patient_id?.name?.charAt(0) || ""}
                        </div>
                        <div className="truncate max-w-[110px] sm:max-w-[160px]">
                             <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                                {patient?.patient_id?.name || "—"}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs truncate">
                                {patient?.user_id?.email || "—"}
                            </p>
                        </div>
                    </div>
                </td>

                {/* age/gender */}
                <td className="py-3 align-middle">
                    <div className="truncate max-w-[110px] sm:max-w-[160px]">
                        <p className="font-medium text-gray-800 dark:text-gray-400 truncate">
                            {patient?.patient_id?.gender || "-"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs truncate">
                            {patient?.patient_id?.age || "-"}
                        </p>

                    </div>
                </td>

                {/* city/country */}
                <td className="py-3 align-middle">
                    <div className="truncate max-w-[110px] sm:max-w-[160px]">
                        <p className="font-medium text-gray-800 dark:text-gray-400 truncate">
                            {patient?.patient_id?.addresses_id?.city || "-"}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs truncate">
                            {patient?.patient_id?.addresses_id?.country || "-"}
                        </p>

                    </div>
                </td>

                {/* blood type */}
                <td className="py-3 align-middle text-gray-800 dark:text-gray-400 font-medium text-center sm:text-left">
                    {patient?.patient_id?.bloodType || "—"}
                </td>
                {/* reg date */}
                <td className="py-3 align-middle text-gray-800 dark:text-gray-400 font-medium text-center sm:text-left">
                     {formatDateTime(patient?.registration_date)|| "-"}
                    {/* {formatDate(patient?.registration_date) || "-"} */}
                </td>
                {/* discharge date */}
                <td className="py-3 align-middle text-gray-800 dark:text-gray-400 font-medium text-center sm:text-left">
                    {patient?.discharge_date ? formatDateTime(patient.discharge_date) : (
                        <span className="text-gray-500 font-medium">
                            N/A
                        </span>
                    )}
                </td>
                {/* next appointment */}
                <td className="py-3 align-middle text-gray-800 dark:text-gray-400 font-medium text-center sm:text-left">
                    {nextDate ? (
                         formatDateTime(nextDate)
                    ) : (
                        <span className="text-gray-400">N/A</span>
                    )}

                </td>

                {/* status */}
                <td className="py-3 align-middle">
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[patient?.status] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                    >
                        {patient?.status || "—"}
                    </span>
                </td>
                {/* actions -edit */}
                <td className="py-3 pr-6 text-center align-middle whitespace-nowrap">
                    <div className="inline-flex items-center gap-3">
                        <button
                            title="Edit"
                            onClick={() => {
                                if (["deleted"].includes(patient.status)) {
                                    toast.error("You can’t edit a deleted patient,contact administrator");
                                    return;
                                }
                                if (onEdit) onEdit(patient);
                            }}
                             className="bg-gray-700 dark:bg-gray-700 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                            <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        {/* Delete */}
                        <button
                            title="Delete patient"
                            onClick={() => handleDelete(patient.patient_id._id)}  
                          className="bg-gray-700 dark:bg-gray-700 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>


                    </div>
                </td>

            </tr>
        </>
    )
}
export default PatientRow