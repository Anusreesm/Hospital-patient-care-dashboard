import { useEffect, useState } from "react"
import Navbar from "../../../Components/Layouts/Navbar"
import Sidebar from "../../../Components/Layouts/Sidebar"
import PatientCreateForm from "./patientCreateForm"
import { GetAllCountries } from "../../../api/CommonApi"
import toast from "react-hot-toast"
import { EmailCheck } from "../../../api/AuthApi"
import { useAuth } from "../../../Context/AuthContext"
import { registerPatient, updatePatient } from "../../../api/PatientApi"
import { useTheme } from "../../../Context/ThemeContext"

const PatientCreate = ({ mode = "create", existingPatient = null, onClose, onRefresh }) => {
    const { userId } = useAuth()
    const { theme } = useTheme();
    const [countries, setCountries] = useState([]);
    const [stateList, setStateList] = useState([]);

    const [formData, setFormData] = useState({
        // patient model
        fullName: existingPatient?.patient_id?.name || "",
        phone: existingPatient?.patient_id?.phone || "",
        email: existingPatient?.user_id?.email || "",
        age: existingPatient?.patient_id?.age || "",
        gender: existingPatient?.patient_id?.gender || "",
        bloodType: existingPatient?.patient_id?.bloodType || "",
        emergencyName: existingPatient?.patient_id?.emergency_name || "",
        emergencyContact: existingPatient?.patient_id?.emergency_contact || "",
        // registration model
        registrationDate: existingPatient?.registration_date
            ? existingPatient.registration_date.split("T")[0]
            : new Date().toISOString().split("T")[0],

        medicalCondition: existingPatient?.medical_condition || "",
        allergies: existingPatient?.allergies || "",
        // address model
        street: existingPatient?.patient_id?.addresses_id?.street || "",
        city: existingPatient?.patient_id?.addresses_id?.city || "",
        state: existingPatient?.patient_id?.addresses_id?.state || "",
        country: existingPatient?.patient_id?.addresses_id?.country || "",
        pincode: existingPatient?.patient_id?.addresses_id?.pincode || "",
        patientExists: null,
        existingEmail: existingPatient?.user_id?.email || ""
    });
    // fetch coutry
    useEffect(() => {
        const loadCountries = async () => {
            const countries = await GetAllCountries();
            console.log("COUNTRY API RESPONSE =>", countries);
            setCountries(countries);
        };

        loadCountries();
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (!formData.country) {
            setStateList([]);
            return;
        }

        const selected = countries.find(
            (c) => c.name === formData.country
        );

        setStateList(selected?.states?.map(s => s.name) || []);
    }, [formData.country, countries]);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const basePatientDetails = {
    //             name: formData.fullName,
    //             phone: formData.phone,
    //             age: formData.age,
    //             gender: formData.gender,
    //             bloodType: formData.bloodType,
    //             emergency_name: formData.emergencyName,
    //             emergency_contact: formData.emergencyContact,
    //             // email: formData.email
    //         };

    //         const addressDetails = {
    //             street: formData.street,
    //             city: formData.city,
    //             state: formData.state,
    //             country: formData.country,
    //             pincode: formData.pincode
    //         };

    //         const registrationDetails = {
    //             registration_date: formData.registrationDate,
    //             medical_condition: formData.medicalCondition,
    //             allergies: formData.allergies,
    //             status: existingPatient?.status || "active"
    //         };


    //         if (mode === "create") {

    //             // Check email before creating
    //             const emailCheck = await EmailCheck(formData.email);
    //             if (emailCheck.status === 409) {
    //                 toast.error("Email already exists!");
    //                 return;
    //             }

    //             const payload = {
    //                 user_id: userId,
    //                 ...basePatientDetails,
    //                 addresses: addressDetails,
    //                 registration: registrationDetails
    //             };

    //             const result = await registerPatient(payload);

    //             if (!result?.success) {
    //                 toast.error(result?.message || "Failed to create patient");
    //                 return;
    //             }

    //             toast.success("Patient created successfully");
    //             onClose?.();
    //             return;
    //         }
    //         if (mode === "update") {

    //             const updatePayload = {
    //                 patient: {
    //                     ...basePatientDetails,
    //                     user_id: existingPatient?.patient_id?.user_id, // KEEP EXISTING USER_ID
    //                     created_by: existingPatient?.patient_id?.created_by // KEEP CREATED_BY
    //                 },
    //                 address: addressDetails,
    //                 reg: registrationDetails,
    //                 user: { name: formData.fullName }
    //             };

    //             // Only include email if it changed
    //             if (formData.email !== existingPatient?.user_id?.email) {
    //                 updatePayload.user.email = formData.email;
    //             }

    //             const patientId = existingPatient?.patient_id?._id;

    //             if (!patientId) {
    //                 toast.error("Patient ID missing");
    //                 return;
    //             }

    //             const result = await updatePatient(patientId, updatePayload);

    //             if (!result?.success) {
    //                 toast.error(result?.message || "Failed to update patient");
    //                 return;
    //             }

    //             toast.success("Patient updated successfully");
    //             onRefresh?.();  // refresh

    //             onClose?.();    // close modal
    //             return
    //         }

    //     } catch (err) {
    //         console.error("Error while submitting patient:", err);
    //         toast.error("Something went wrong");
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare the payload in the flat structure backend expects
            const payload = {
                user_id: userId,
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                age: Number(formData.age),
                gender: formData.gender,
                bloodType: formData.bloodType,
                emergency_name: formData.emergencyName || null,
                emergency_contact: formData.emergencyContact || null,
                addresses: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    pincode: formData.pincode.toString()
                },
                registration: {
                    registration_date: formData.registrationDate,
                    medical_condition: formData.medicalCondition || null,
                    allergies: formData.allergies || null,
                    status: "active"
                }
            };

            if (mode === "create") {
                if (!formData.patientExists || formData.email !== formData.existingEmail) {
                    const emailCheck = await EmailCheck(formData.email);
                    console.log(emailCheck, "email")
                    if (emailCheck.status === 409) {
                        toast.error("Email already exists!");
                        return;
                    }
                }

                const result = await registerPatient(payload);

                if (!result?.success) {
                    toast.error(result?.message || "Failed to create patient");
                    return;
                }

                toast.success("Patient created successfully");
                // reset form
                setFormData({
                    fullName: "",
                    phone: "",
                    email: "",
                    age: "",
                    gender: "",
                    bloodType: "",
                    emergencyName: "",
                    emergencyContact: "",
                    registrationDate: new Date().toISOString().split("T")[0],
                    medicalCondition: "",
                    allergies: "",
                    street: "",
                    city: "",
                    state: "",
                    country: "",
                    pincode: "",
                    patientExists: null,
                    existingEmail: ""
                });
                onClose?.();
                return;
            }

            if (mode === "update") {
                const updatePayload = {
                    updatePatientDetails: {
                        name: formData.fullName,
                        phone: formData.phone,
                        age: Number(formData.age),
                        gender: formData.gender,
                        bloodType: formData.bloodType,
                        emergency_name: formData.emergencyName || null,
                        emergency_contact: formData.emergencyContact || null
                    },
                    updateAddressDetails: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        country: formData.country,
                        pincode: formData.pincode.toString()
                    },
                    updateRegDetails: {
                        registration_date: formData.registrationDate,
                        medical_condition: formData.medicalCondition || null,
                        allergies: formData.allergies || null,
                        status: existingPatient?.status || "active"
                    },
                    userUpdates: {}
                };

                if (formData.email !== existingPatient?.user_id?.email) {
                    updatePayload.userUpdates.email = formData.email;
                }

                const patientId = existingPatient?.patient_id?._id;
                if (!patientId) {
                    toast.error("Patient ID missing");
                    return;
                }

                // Send as body of PUT request
                const result = await updatePatient(patientId, updatePayload);

                if (!result?.success) {
                    toast.error(result?.message || "Failed to update patient");
                    return;
                }

                toast.success("Patient updated successfully");
                onRefresh?.();
                onClose?.();
                return;
            }

        } catch (err) {
            console.error("Error while submitting patient:", err);
            toast.error("Something went wrong");
        }
    };






    // create patient
    return (
        <>
            {mode === "create" ? (
                <div className={`flex flex-col sm:flex-row min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Navbar />
                        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
                            <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                                Register a new patient in the hospital system
                            </h1>
                            <div className="flex-1 flex flex-col items-center justify-center ">

                                <PatientCreateForm
                                    formData={formData}
                                    handleSubmit={handleSubmit}
                                    setFormData={setFormData}
                                    mode={mode}
                                    countries={countries}
                                    states={stateList}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Popup/modal layout for updating
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className={`rounded-2xl shadow-lg w-full max-w-3xl p-6 sm:p-8 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"} rounded-2xl shadow-lg p-8 w-full max-w-3xl relative`}>
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                        >
                            ✕
                        </button>
                        <PatientCreateForm
                            formData={formData}
                            handleSubmit={handleSubmit}
                            setFormData={setFormData}
                            mode={mode}
                            countries={countries}
                            states={stateList}
                        />


                    </div>
                </div>
            )}
        </>
    )
}
export default PatientCreate