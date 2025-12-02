import { useEffect, useState } from "react";
import Navbar from "../../../Components/Layouts/Navbar"
import Sidebar from "../../../Components/Layouts/Sidebar"
import { useAuth } from "../../../Context/AuthContext";

import { GetAllPatients } from "../../../api/PatientApi";
import { GetAllHospStaff } from "../../../api/HospStaff";
import { getAllSpecializations } from "../../../api/SpecializationMasterApi";
import AppointmentCreateForm from "./AppointmentCreateForm";
import toast from "react-hot-toast";
import { BookAppointment, UpdateAppointment } from "../../../api/AppointmentApi";
import { useNavigate } from "react-router";
import { useTheme } from "../../../Context/ThemeContext";

const AppointmentCreate = ({ mode = "create", existingAppointment = null, onClose }) => {
    const { userRole, userName } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [appointmentId, setAppointmentId] = useState(null)
    const [formData, setFormData] = useState({
        patientId: existingAppointment?.patient_id?._id || existingAppointment?.patientId || "",
        patientEmail: existingAppointment?.patient_id?.user_id?.email || existingAppointment?.patientEmail || "",
        hospitalStaffId: existingAppointment?.hosp_staff_id?._id || existingAppointment?.hospitalStaffId || "",
        specId: existingAppointment?.specialization_id?._id || existingAppointment?.specId || "",
        date: existingAppointment?.date || "",
        time: existingAppointment?.time || "",
        amount: existingAppointment?.amount || "",
    });


    // book apointment
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { patientId, hospitalStaffId, specId, date, time, amount } = formData;

        if (!patientId || !hospitalStaffId || !specId || !date || !time || !amount) {
            toast.error("Please fill all required fields");
            return;
        }
        if (["confirmed", "completed", "cancelled"].includes(existingAppointment?.status)) {
            toast.error("You cannot edit this appointment.");
            return;
        }

        let normalizedDate = "";
        if (formData.date) {
            const d = new Date(formData.date);
            normalizedDate = d.toISOString().split("T")[0];  // YYYY-MM-DD
        }

        try {
            if (mode === "create") {
                const appointmentData = {
                    patient_id: patientId,
                    hosp_staff_id: hospitalStaffId,
                    specialization_id: specId,
                    date: normalizedDate,
                    time,
                    amount,
                };

                const res = await BookAppointment(appointmentData);


                if (res.success) {
                    toast.success("Appointment booked successfully!");
                    // setFormData({
                    //     patientId: "",
                    //     patientEmail: "",
                    //     hospitalStaffId: "",
                    //     specId: "",
                    //     date: "",
                    //     time: "",
                    //     amount: "",
                    // });
                    // after appointment >>to payment
                    // const appointmentId = res.data?.appointment?._id || res.data?._id;
                    // navigate(`/${userRole}/payment/create?appointment_id=${appointmentId}&amount=${formData.amount}`);
                    const newId = res.data?.appointment?._id || res.data?._id;
                    setAppointmentId(newId); // store the appointment for payment later

                } else {
                    toast.error(res.message || "Failed to book appointment");
                }
            }
            else if (mode === "update") {
                const updatedData = {
                    patient_id: patientId,
                    hosp_staff_id: hospitalStaffId,
                    specialization_id: specId,
                    date,
                    time,
                    amount
                };

                const res = await UpdateAppointment(existingAppointment._id, updatedData);

                if (res.success) {
                    toast.success("Appointment updated successfully!");
                    const updatedId = existingAppointment._id;
                    setAppointmentId(updatedId);

                    // Keep form data in sync (so Make Payment button will have latest info)
                    setFormData((prev) => ({
                        ...prev,
                        ...updatedData
                    }));
                } else {
                    toast.error(res.message || "Failed to update appointment");
                }
            }
        } catch (err) {
            console.error("Error while submitting appointment:", err);
            toast.error("Something went wrong");
        }
    };

    // make payment
    const handleMakePayment = async () => {
        try {
            // Step 1: If appointment is new and not yet saved
            if (!appointmentId && mode === "create") {
                toast.error("Please book the appointment first before making payment");
                return;
            }

            // Step 2: If in update mode, ensure latest form values are saved first
            if (mode === "update") {
                // Normalize date and time formats
                const formattedDate = formData.date
                    ? new Date(formData.date).toISOString().split("T")[0] // => "YYYY-MM-DD"
                    : "";
                const formattedTime = formData.time
                    ? formData.time.slice(0, 5) // => "HH:mm"
                    : "";

                const updatedData = {
                    patient_id: formData.patientId,
                    hosp_staff_id: formData.hospitalStaffId,
                    specialization_id: formData.specId,
                    date: formattedDate,
                    time: formattedTime,
                    amount: formData.amount
                };

                const res = await UpdateAppointment(existingAppointment._id, updatedData);

                if (res.success) {
                    toast.success("Appointment updated successfully before payment!");

                    // Update local state
                    setFormData((prev) => ({ ...prev, ...updatedData }));
                    setAppointmentId(existingAppointment._id);

                    // Redirect to payment
                    navigate(
                        `/${userRole}/payment/create?appointment_id=${existingAppointment._id}&amount=${formData.amount}`
                    );
                } else {
                    toast.error(res.message || "Failed to update appointment before payment");
                }
            } else {
                // Step 3: Normal payment redirect (for create mode)
                if (!appointmentId) {
                    toast.error("Please book the appointment first before making payment");
                    return;
                }

                navigate(
                    `/${userRole}/payment/create?appointment_id=${appointmentId}&amount=${formData.amount}`
                );
            }
        } catch (err) {
            console.error("Error in handleMakePayment:", err);
            toast.error("Something went wrong while preparing payment");
        }
    };


    //   fetch data
    useEffect(() => {
        // to fetch all patients
        const fetchPatients = async () => {
            try {
                const res = await GetAllPatients();
                setPatients(Array.isArray(res?.data?.patient) ? res.data.patient : []);
            } catch (err) {
                console.error(err);
            }
        };
        // to fetch all doctors
        const fetchDoctors = async () => {
            try {
                const res = await GetAllHospStaff();
                const allStaff = (Array.isArray(res?.data?.staffs) ? res.data.staffs : []);
                const onlyDoctors = allStaff.filter(
                    (s) => s?.user_id?.role === "doctor"
                );
                setDoctors(onlyDoctors);
            }
            catch (err) {
                console.error(err)
            }
        }
        // to fetch all specializations
        const fetchSpecz = async () => {
            try {
                const res = await getAllSpecializations();
                setSpecializations(Array.isArray(res?.data?.spec) ? res.data.spec : []);
            }
            catch (err) {
                console.error(err)
            }
        }
        fetchPatients();
        fetchDoctors();
        fetchSpecz();
    }, []);
    return (
        <>
            {mode === "create" ? (
                <div className={`flex flex-col sm:flex-row min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Navbar />
                        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
                            <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                                {userRole === "admin" && `Assist in booking an appointment - ${userName}`}
                                {userRole === "staff" && `Assist in booking an appointment - ${userName}`}
                                {userRole === "patient" && `Book Your Appointment - ${userName}`}</h1>
                            <div className="flex-1 flex flex-col items-center justify-center ">

                                <AppointmentCreateForm
                                    formData={formData}
                                    handleSubmit={handleSubmit}
                                    setFormData={setFormData}
                                    mode={mode}
                                    patients={patients}
                                    doctors={doctors}
                                    specializations={specializations}
                                    onMakePayment={handleMakePayment}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Popup/modal layout for updating
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 ">
                    {/* <div className={`bg-white ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"} rounded-2xl shadow-lg p-8 w-full max-w-3xl relative`}> */}
                    <div
                        className={`${theme === "dark"
                            ? "bg-gray-800 text-gray-100"
                            : "bg-white text-gray-800"
                            } rounded-2xl shadow-lg p-6 w-full max-w-3xl relative 
     max-h-[90vh] overflow-y-auto`}
                    >


                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                        >
                            ✕
                        </button>
                        <div className="flex flex-col items-center">
                            <AppointmentCreateForm
                                formData={formData}
                                handleSubmit={handleSubmit}
                                setFormData={setFormData}
                                mode={mode}
                                patients={patients}
                                doctors={doctors}
                                specializations={specializations}
                                onMakePayment={handleMakePayment}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default AppointmentCreate