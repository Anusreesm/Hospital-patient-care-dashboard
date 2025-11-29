import { useEffect, useState } from "react"
import { GetAllReg } from "../../api/RegApi"
import toast from "react-hot-toast"
import PatientRow from "./patientRow"
import PatientCreate from "../../Pages/Common/patientManagement/patientCreate"
import { GetAllAppointment } from "../../api/AppointmentApi"
import PageWrapper from "../pageWrappers"


const PatientTable = ({ patient = [] }) => {
    const [patients, setPatients] = useState([])
    const [allPatients, setAllPatients] = useState([])
    const [appointments, setAppointments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // fetch patients
    const fetchPatients = async () => {
        try {
            const res = await GetAllReg();
             console.log("PATIENT SAMPLE:", res.data.patient);
            if (Array.isArray(res?.data?.reg)) {
                setPatients(res.data.reg);
                setAllPatients(res.data.reg);
            }
            else {
                toast.error("Unexpected data format");
                setPatients([])
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Error fetching patients");
            setPatients([])
        }
    };


    // fetch appointments

    const fetchAppointments = async () => {
        try {
            const res = await GetAllAppointment();
            console.log(res, "response");

            if (Array.isArray(res?.data?.appointments)) {
                setAppointments(res.data.appointments);
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchPatients();
        fetchAppointments();
    }, [])
 


    useEffect(() => {
        if (patient?.length) {
            // if filter applied, use filtered list
            setPatients(patient);
        } else {
            // otherwise, show all patients
            setPatients(allPatients);
        }
    }, [patient, allPatients]);

    const getNextAppointment = (regId) => {
        const match = appointments.find(
            (a) =>
                String(a.reg_id?._id ?? a.reg_id) === String(regId) &&
                ["confirmed"].includes(a.status)
        );
        if (!match) return null;
        const date = match.date || match.appointment_date;

        if (!date || isNaN(new Date(date))) return null;

        return date;
    };

    // handle delete
    const handleDelete = (deletedId) => {
        setPatients((prev) => prev.filter((reg) => reg._id !== deletedId));
    };
    // handle edit
    const handleEdit = (patientData) => {
        setSelectedPatient(patientData);
        setShowModal(true);
    };
    // Called when patient updated successfully
    // const handleUpdateSuccess = async () => {
    //     await fetchPatients(); // Re-fetch all patients from backend
    // };


    return (
        <>
        <PageWrapper>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-3 sm:p-4 w-full">

                <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">
                     All Registrations (Includes past & new entries) ({patients.length})
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                    Manage patient records and medical information
                </p>
                <div className="overflow-x-auto">
                    {patients.length > 0 ? (
                        <table className="min-w-[600px] sm:min-w-full text-sm text-left table-fixed">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                                    <th className="py-2">Patient</th>
                                    <th>Age/Gender</th>
                                    <th>City/Country</th>
                                    <th>Blood Type</th>
                                    <th>Reg Date</th>
                                    <th>Discharged Date</th>
                                    <th>Next Appointment</th>
                                    <th>status</th>
                                    <th className="py-2 text-center pr-6 w-[180px]">Actions</th>

                                </tr>
                            </thead>
                            <tbody className="text-gray-800 dark:text-gray-200">
                                {patients.map((p) => (
                                    <PatientRow
                                        key={p._id}
                                        patient={p}
                                        nextAppointment={getNextAppointment}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onUpdate={fetchPatients}
                                    />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                            No Patients found.
                        </p>
                    )}
                </div>

                {showModal && selectedPatient && (
                    <PatientCreate
                        mode="update"
                        existingPatient={selectedPatient}
                        onClose={() => setShowModal(false)}
                        onRefresh={fetchPatients}
                    />


                )}


            </div>
            </PageWrapper>
        </>
    )
}

export default PatientTable