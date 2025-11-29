import React, { useEffect } from "react";
import Input from "../../../Components/Forms/Input";
import Select from "../../../Components/Forms/Select";
import { useAuth } from "../../../Context/AuthContext";
import { getUserById } from "../../../api/AuthApi";
import { useTheme } from "../../../Context/ThemeContext";

const AppointmentCreateForm = ({
    formData,
    handleSubmit,
    setFormData,
    onMakePayment,
    mode = "create",
    patients,
    doctors,
    specializations
}) => {

    const { userRole, userId, userName } = useAuth();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchPatient = async () => {
            if (userRole === "patient" && userId) {
                try {
                    const res = await getUserById(userId);

                    const userData = res.data?.user || res.data || res;
                    setFormData((prev) => ({
                        ...prev,
                        patientId: userData._id,
                        patientName: userData.name,
                        patientEmail: userData.email,
                    }));
                    console.log("Fetched user data:", userData);

                } catch (error) {
                    console.error("Error fetching patient:", error);
                }
            }
        };

        fetchPatient();
    }, [userRole, userId, setFormData]);
    return (
        <>
            <form className={`rounded-lg border  shadow-sm w-full max-w-4xl p-8
                ${theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"}
            `}
                onSubmit={handleSubmit}
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-9 ">
                    {userRole !== "patient" ? (
                        <>
                            {/* Patient Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2 dark:text-gray-100">
                                    Patient Name
                                </label>
                                <Select
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={(e) => {
                                        const selectedPatient = patients.find(
                                            (p) => p._id === e.target.value
                                        );
                                        setFormData((prev) => ({
                                            ...prev,
                                            patientId: e.target.value,
                                            patientEmail: selectedPatient?.user_id?.email || "",
                                            patientName: selectedPatient?.name || "",
                                        }));
                                    }}
                                    required
                                    className="border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-800 
                                               text-gray-800 dark:text-gray-100
                                               rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="">Select Patient</option>
                                    {patients.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </Select>
                            </div>

                            {/* Patient Email */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-100 font-medium mb-2">
                                    Patient Email
                                </label>
                                <Input
                                    type="email"
                                    name="patientEmail"
                                    placeholder="Patient Email"
                                    value={formData.patientEmail || ""}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    readOnly
                                />
                            </div>
                        </>


                    ) : (
                        /*  Patient — show their info read-only */
                        <>
                       
                            <div className="mb-4">
                               
                                <label className="block text-gray-700 dark:text-gray-100 font-medium mb-2">
                                    Patient Name
                                </label>
                                <Input
                                    type="text"
                                    name="patientName"
                                    value={formData.patientName || userName || ""}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-900"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-100 font-medium mb-2">
                                    Patient Email
                                </label>
                                <Input
                                    type="email"
                                    name="patientEmail"
                                    value={formData.patientEmail || userId?.email || ""}
                                    readOnly
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100  dark:bg-gray-900"
                                />
                            </div>
                        </>
                    )}
                    {/* Specialization */}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-100 font-medium mb-2">Specialization</label>
                        <Select
                            name="specId"
                            value={formData.specId}
                            onChange={(e) => {
                                const selectedSpecId = e.target.value;
                                setFormData((prev) => ({
                                    ...prev,
                                    specId: selectedSpecId,
                                    hospitalStaffId: "", // reset doctor when specialization changes
                                    specializationName:
                                        specializations.find((s) => s._id === selectedSpecId)
                                            ?.spec_name || "",
                                }));
                            }}
                            required
                            className="border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-700 
                                               text-gray-800 dark:text-gray-100
                                               rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">
                                Select Specialization</option>

                            {specializations.map((s) => (
                                <option key={s._id} value={s._id}>
                                    {s.spec_name}
                                </option>
                            ))}
                        </Select>
                    </div>


                    {/* Hospital Staff */}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-100 font-medium mb-2">Doctor's Name</label>
                        <Select
                            name="hospitalStaffId"
                            value={formData.hospitalStaffId}
                            onChange={(e) => {
                                const selectedDoctor = doctors.find((d) => d._id === e.target.value);
                                setFormData((prev) => ({
                                    ...prev,
                                    hospitalStaffId: e.target.value,
                                    specId: selectedDoctor?.specialization_id?._id || "",
                                    specializationName:
                                        selectedDoctor?.specialization_id?.spec_name || "",
                                }));
                            }}
                            required
                            className="border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-700 
                                               text-gray-800 dark:text-gray-100
                                               rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Select Doctor</option>
                            {(formData.specId
                                ? doctors.filter((d) => d?.specialization_id?._id === formData.specId)
                                : doctors
                            ).map((d) => (
                                <option key={d._id} value={d._id}>
                                    {d.user_id?.name || d.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    {/* Date */}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-100 font-medium mb-2">Date</label>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date ? formData.date.split("T")[0] : ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    date: e.target.value,
                                }))
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            min={new Date().toISOString().split("T")[0]} //  disable past dates
                            required
                        />
                    </div>

                    {/* Time */}
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-100 font-medium mb-2">Time</label>
                        <Input
                            type="time"
                            name="time"
                            value={formData.time || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    time: e.target.value,
                                }))
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            lang="en-GB"
                            required
                        />
                    </div>

                    {/* Fees */}
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-100 font-medium mb-2">Fees</label>
                        <Input
                            type="number"
                            name="amount"
                            value={formData.amount || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    amount: e.target.value,
                                }))
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            min="0"

                            required
                        />
                    </div>

                </div>
                <div className="flex flex-row  gap-2">
                    {/* Button */}
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">
                        {mode === "create" ? "Book Appointment" : "Save Changes"}

                    </button>
                    {/* Make Payment Button */}
                    <button
                        type="button"
                        onClick={() => {
                            onMakePayment && onMakePayment(formData)
                        }}
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700"
                    >
                        Make Payment
                    </button>
                </div>


            </form>
        </>
    );
};
export default React.memo(AppointmentCreateForm)