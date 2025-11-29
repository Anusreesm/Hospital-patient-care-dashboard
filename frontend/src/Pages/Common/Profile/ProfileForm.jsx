import { useEffect, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { GetAllHospStaff, updateHospStaff } from "../../../api/HospStaff";
import { GetAllUsers } from "../../../api/AuthApi";
import { GetAllPatients, updatePatient } from "../../../api/PatientApi";

const ProfileForm = () => {
    const { userRole, user } = useAuth();
    const [staffId, setStaffId] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        emergency_name: "",
        emergency_contact: ""
    });
    const isPatient = userRole === "patient";
    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await GetAllUsers();
                const hospRes = await GetAllHospStaff();
                const patientRes = await GetAllPatients();

                const users = usersRes?.data?.users || [];
                const staff = hospRes?.data?.staffs || [];
                const patients = patientRes?.data?.patient || [];

                const currentUser = users.find(u => u._id === user.id);
                if (userRole === "staff") {
                    const currentStaff = staff.find(s => s.user_id._id === user.id);
                    setFormData({
                        name: currentUser?.name || "",
                        email: currentUser?.email || "",
                        phone: currentStaff?.phone?.replace("+91", "") || ""
                    });
                    setStaffId(currentStaff?._id || null);
                }

                if (userRole === "patient") {
                    const currentPatient = patients.find(p => p.user_id._id === user.id);
                    console.log(currentPatient)
                    setFormData({
                        name: currentPatient?.name || "",
                        email: currentUser?.email || "",
                        phone: currentPatient?.phone?.replace("+91", "") || "",
                        age: currentPatient?.age || "",
                        gender: currentPatient?.gender || "",
                        emergency_name: currentPatient?.emergency_name || "",
                        emergency_contact: currentPatient?.emergency_contact || ""
                    });
                    setPatientId(currentPatient?._id || null);
                }
            } catch (error) {
                console.log(error);
                toast.error("Error fetching profile data");
            }
        };
        fetchData();
    }, [user.id, userRole]);


    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // const handleUpdate = async () => {
    //     if (!staffId) return toast.error("Staff record not found");
    //     if (!formData.name.trim()) {
    //         return toast.error("Name cannot be empty");
    //     }

    //     // Email format validation
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(formData.email)) {
    //         return toast.error("Please enter a valid email address");
    //     }

    //     // Phone validation (10 digits)
    //     const phoneRegex = /^[0-9]{10}$/;
    //     if (!phoneRegex.test(formData.phone)) {
    //         return toast.error("Phone number must be 10 digits");
    //     }
    //     try {
    //         const res = await updateHospStaff(staffId, {
    //             name: formData.name,
    //             phone: formData.phone,
    //             email: formData.email // optional, only if email change needs to be handled
    //         });

    //         if (!res.success) {
    //             return toast.error(res.message || "Update failed");
    //         }


    //         toast.success("Profile updated successfully");
    //     } catch (error) {
    //         console.log(error);
    //         const backendMsg = error?.response?.data?.message;
    //         if (backendMsg) {
    //             return toast.error(backendMsg);
    //         }
    //         toast.error("Error updating profile");
    //     }
    // };
    const handleUpdate = async () => {
        if (isPatient) {
            if (!patientId) return toast.error("Patient record not found");
            if (!formData.name.trim()) return toast.error("Name cannot be empty");

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) return toast.error("Please enter a valid email address");

            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(formData.phone)) return toast.error("Phone number must be 10 digits");

            try {
                const res = await updatePatient(patientId, {
                    updatePatientDetails: {
                        name: formData.name,
                        phone: formData.phone,
                        age: formData.age,
                        gender: formData.gender,
                        emergency_name: formData.emergency_name || null,
                        emergency_contact: formData.emergency_contact || null
                    },
                    userUpdates: {
                        name: formData.name,
                        email: formData.email
                    }
                });

                if (!res.success) return toast.error(res.message || "Update failed");
                toast.success("Profile updated successfully");
            } catch (error) {
                console.log(error);
                const backendMsg = error?.response?.data?.message;
                if (backendMsg) return toast.error(backendMsg);
                toast.error("Error updating profile");
            }
        } else {
            // Staff update
            if (!staffId) return toast.error("Staff record not found");
            if (!formData.name.trim()) return toast.error("Name cannot be empty");

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) return toast.error("Please enter a valid email address");

            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(formData.phone)) return toast.error("Phone number must be 10 digits");

            try {
                const res = await updateHospStaff(staffId, {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email
                });

                if (!res.success) return toast.error(res.message || "Update failed");
                toast.success("Profile updated successfully");
            } catch (error) {
                console.log(error);
                const backendMsg = error?.response?.data?.message;
                if (backendMsg) return toast.error(backendMsg);
                toast.error("Error updating profile");
            }
        }
    };

    return (
        <form className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
            {/* Heading */}
            <h2 className="text-2xl font-semibold text-center mb-2 text-gray-800 dark:text-gray-200">
                Edit Profile
            </h2>

            {/* General Note */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                Please note: Updating these details will immediately update your profile information.
            </p>

            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Full Name */}
                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Changing your email will update your login. You’ll need to use the new email next time you log in.
                    </span>
                </div>

                {/* ---------- PATIENT ONLY FIELDS ---------- */}
                {isPatient && (
                    <>
                        {/* Age */}
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Other</option>
                            </select>
                        </div>


                        {/* Emergency Contact Name */}
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Emergency Contact Name
                            </label>
                            <input
                                type="text"
                                name="emergency_name"
                                value={formData.emergency_name}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Emergency name"
                            />
                        </div>

                        {/* Emergency Contact Number */}
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Emergency Contact Number
                            </label>
                            <input
                                type="text"
                                name="emergency_contact"
                                value={formData.emergency_contact}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Emergency number"
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Update Button */}
            <div className="mt-8 flex justify-center">
                <button
                    type="button"
                    onClick={handleUpdate}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                    Update
                </button>
            </div>
        </form>
    );
};

export default ProfileForm;
