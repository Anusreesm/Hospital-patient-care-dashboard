import { useEffect, useState } from "react";
import Navbar from "../../../../Components/Layouts/Navbar"
import Sidebar from "../../../../Components/Layouts/Sidebar"
import CreateRequestForm from "./createRequestForm"
import toast from "react-hot-toast";
import { CreateBloodReq, GetConfrimedAppointment, UpdateBloodReq } from "../../../../api/BloodBankReqApi";
import { GetAllPatients } from "../../../../api/PatientApi";
import { useTheme } from "../../../../Context/ThemeContext";

const CreateRequest = ({ mode = "create", existingReq = null, onClose, onRefresh }) => {
    const [patients, setPatients] = useState([]);
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        appointmentId: existingReq?.appointment_id?._id || "",
        patientId: existingReq?.appointment_id?.patient_id?._id || "",
        userId: existingReq?.appointment_id?.patient_id?.user_id || "",
        doctor: existingReq?.appointment_id?.hosp_staff_id?.name || "",
        specz: existingReq?.appointment_id?.specialization_id?.spec_name || "",
        bloodType: existingReq?.appointment_id?.patient_id?.bloodType || "",
        unitsRequired: existingReq?.units_required || "",
        priority: existingReq?.priority || "",
        date: existingReq?.request_date ? existingReq.request_date.split("T")[0] : "",
        reason: existingReq?.reason || ""
    });




    // create request
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { appointmentId, patientId, unitsRequired, priority, date } = formData;
        if (!appointmentId || !patientId || !unitsRequired || !priority || !date) {
            toast.error("Please fill all required fields");
            return;
        }
        try {
            // creation
            if (mode === "create") {
                const requestData = {
                    user_id: formData.userId,
                    appointment_id: appointmentId,
                    patient_id: patientId,
                    units_required: unitsRequired,
                    priority,
                    request_date: date,
                    reason: formData.reason || ""
                }
                const res = await CreateBloodReq(requestData)
                if (!res?.success) {
                    toast.error(res?.message || "Failed to  request");
                    return;
                }
                toast.success("Request created successfully");
                // setFormData((prev) => ({
                //     ...prev,
                //     appointmentId: "",
                //     patientId: "",
                //     unitsRequired: "",
                //     priority: "",
                //     date: "",
                //     doctor: "",
                //     specz: "",
                //     bloodType: "",
                //     reason: ""
                // }));
                setFormData({
                    appointmentId: "",
                    patientId: "",
                    userId: "",
                    doctor: "",
                    specz: "",
                    bloodType: "",
                    unitsRequired: "",
                    priority: "",
                    date: "",
                    reason: ""
                });
                onClose?.();
                return;
            }
            // updation
            if (mode === "update") {
                const updatedData = {
                    user_id: formData.userId,
                    appointment_id: appointmentId,
                    patient_id: patientId,
                    units_required: Number(formData.unitsRequired),
                    priority,
                    request_date: date,
                    reason: formData.reason || ""
                };

                const updatedId = existingReq._id;

                if (!updatedId) {
                    toast.error("Request ID missing");
                    return;
                }
                const res = await UpdateBloodReq(updatedId, updatedData)
                if (!res?.success) {
                    toast.error(res?.message || "Failed to update req");
                    return;
                }
                toast.success("Req updated successfully");

                onRefresh?.();
                onClose?.();    // close modal
                // return
            }
        }
        catch (err) {
            console.error("Error while requesting:", err);
            toast.error("Something went wrong");
        }

    }
    // FETCH CONFIRMED APPOINTMENTS
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await GetConfrimedAppointment();
                const arr = Array.isArray(res?.data?.confirmedAppointments)
                    ? res.data.confirmedAppointments
                    : [];
                setPatients(arr);
            } catch (err) {
                console.error(err);
            }
        };


        fetchPatients();
    }, []);


    return (
        <>
            {mode === "create" ? (
                <div className={`flex flex-col sm:flex-row min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Navbar />
                        <div className="flex-1 flex items-center justify-center p-6">
                            <div className="bg-white bg-opacity-90 backdrop-blur-md dark:bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-lg">
                                <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-6 text-center">
                                    Add New Request
                                </h1>
                                <CreateRequestForm
                                    formData={formData}
                                    patients={patients}
                                    handleSubmit={handleSubmit}
                                    setFormData={setFormData}
                                    mode={mode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Popup/modal layout for updating
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
                    <div
                        className="
      rounded-2xl shadow-lg p-8 w-full max-w-3xl relative
      max-h-[90vh] overflow-y-auto
      bg-white dark:bg-gray-800 
      text-gray-800 dark:text-gray-100
    "
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-600 text-2xl"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4 text-center">
                            Update Blood Request
                        </h2>

                        <CreateRequestForm
                            formData={formData}
                            patients={patients}
                            handleSubmit={handleSubmit}
                            setFormData={setFormData}
                            mode={mode}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
export default CreateRequest