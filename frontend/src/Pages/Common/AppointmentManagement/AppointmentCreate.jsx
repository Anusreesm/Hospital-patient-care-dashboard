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

const AppointmentCreate = ({ mode = "create", existingAppointment = null, onClose }) => {
    const { userRole, userName } = useAuth();
     const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [formData, setFormData] = useState({
        patientId: existingAppointment?.patient_id?._id || existingAppointment?.patientId || "",
        patientEmail: existingAppointment?.patient_id?.user_id?.email || existingAppointment?.patientEmail || "",
        hospitalStaffId: existingAppointment?.hosp_staff_id?._id || existingAppointment?.hospitalStaffId || "",
        specId: existingAppointment?.specialization_id?._id || existingAppointment?.specId || "",
        date: existingAppointment?.date || "",
        time: existingAppointment?.time || "",
        amount: existingAppointment?.amount || "",
    });



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


        try {
            if (mode === "create") {
                const appointmentData = {
                    patient_id: patientId,
                    hosp_staff_id: hospitalStaffId,
                    specialization_id: specId,
                    date,
                    time,
                    amount,
                };

                const res = await BookAppointment(appointmentData);
                

                if (res.success) {
                    toast.success("Appointment booked successfully!");
                    setFormData({
                        patientId: "",
                        patientEmail: "",
                        hospitalStaffId: "",
                        specId: "",
                        date: "",
                        time: "",
                        amount: "",
                    });

                              navigate(`/${userRole}/payment/create`);

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
                    onClose(true); // close modal and refresh parent table
                } else {
                    toast.error(res.message || "Failed to update appointment");
                }
            }
        } catch (err) {
            console.error("Error while submitting appointment:", err);
            toast.error("Something went wrong");
        }
    };


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
                <div className="flex flex-col sm:flex-row min-h-screen bg-gray-50">
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Navbar />
                        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
                            <h1 className="text-lg sm:text-2xl font-semibold text-gray-800">
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
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Popup/modal layout for updating
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl relative">
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                        >
                            ✕
                        </button>
                        <AppointmentCreateForm
                            formData={formData}
                            handleSubmit={handleSubmit}
                            setFormData={setFormData}
                            mode={mode}
                            patients={patients}
                            doctors={doctors}
                            specializations={specializations}
                        />
                    </div>
                </div>
            )}
        </>
    );
};
export default AppointmentCreate