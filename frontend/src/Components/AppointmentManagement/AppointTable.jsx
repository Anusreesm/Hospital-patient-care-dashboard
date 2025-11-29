
import toast from "react-hot-toast";
import AppointRow from "./AppointRow";
import { GetAllAppointment } from "../../api/AppointmentApi";
import AppointmentCreate from "../../Pages/Common/AppointmentManagement/AppointmentCreate";
import { useEffect, useState } from "react";
import PageWrapper from "../pageWrappers";
const AppointTable = ({ appointment = [] }) => {

    const [appointments, setAppointments] = useState([]);

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // to get all appointments
    const fetchAppointments = async () => {
        try {
            const res = await GetAllAppointment();
            if (Array.isArray(res?.data?.appointments)) {
                setAppointments(res.data.appointments);
            } else {
                toast.error("Unexpected data format");
                setAppointments([]);
            }
        }
        catch (error) {
            console.log(error)
            toast.error("Error fetching appointments");
            setAppointments([])
        }
    };
    useEffect(() => {
        fetchAppointments();
    }, []);

    // Sync filtered data from parent component
    useEffect(() => {
        if (appointment?.length) {
            setAppointments(appointment);
        } else {
            setAppointments([]);
        }
    }, [appointment]);
    // handle delete
    const handleDelete = (deletedId) => {
        setAppointments((prev) => prev.filter((appoint) => appoint._id !== deletedId));
    };
    // handle edit
    const handleEdit = (appointmentData) => {
        setSelectedAppointment(appointmentData);
        setShowModal(true);
    };
    // Called when appointment updated successfully
    const handleUpdateSuccess = async () => {
        await fetchAppointments(); // Re-fetch latest data after update

    };

    return (
        <>
        <PageWrapper>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-3 sm:p-4 w-full">
                <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">
                    Appointments ({appointments.length})
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                    Manage scheduled appointments
                </p>
                <div className="overflow-x-auto">
                    {appointments.length > 0 ? (
                        <table className="min-w-[600px] sm:min-w-full text-sm text-left table-fixed">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                                    <th className="py-2">Patient</th>
                                    <th>Doctor</th>
                                    <th>Date & Time</th>
                                    <th>Status</th>
                                    <th>Fees</th>
                                    <th>Token No.</th>
                                    <th className="py-2 text-center pr-6 w-[180px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800 dark:text-gray-200">
                                {appointments.map((p) => (
                                    <AppointRow
                                        key={p._id}
                                        appointment={p}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onUpdate={fetchAppointments}
                                    />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                            No appointments found.
                        </p>
                    )}
                </div>
                {showModal && selectedAppointment && (
                    <AppointmentCreate
                        mode="update"
                        existingAppointment={selectedAppointment}
                        onClose={(updated) => {
                            setShowModal(false);
                            if (updated) handleUpdateSuccess();
                        }}
                    />
                )}


            </div>
            </PageWrapper>
        </>
    )
}
export default AppointTable