import { useEffect, useState } from "react"
import Select from "../../../Components/Forms/Select"
import { getAllDepartments } from "../../../api/DeptMasterApi"
import { getAllSpecializations } from "../../../api/SpecializationMasterApi"
import { RegisterHospStaff as registerStaffApi, updateHospStaff } from "../../../api/HospStaff"
import Sidebar from "../../../Components/Layouts/Sidebar"
import Navbar from "../../../Components/Layouts/Navbar"
import toast from "react-hot-toast"
import HospStaffForm from "./HospStaffForm"
import { EmailCheck } from "../../../api/AuthApi"
import { useTheme } from "../../../Context/ThemeContext"

const HospStaffReg = ({ mode = "create", existingStaff = null, onClose }) => {
    const [departments, setDepartments] = useState([]);
    const { theme } = useTheme();
    const [specializations, setSpecializations] = useState([]);

    const [formData, setFormData] = useState({
        name: existingStaff?.name || "",
        email: existingStaff?.user_id?.email || "",
        phone: existingStaff?.phone || "",
        deptId: existingStaff?.dept_id?._id || "",
        medicalLicense: existingStaff?.medical_license || "",
        expYears: existingStaff?.exp_years || "",
        specializationId: existingStaff?.specialization_id?._id || "",
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    useEffect(() => {
        const fetchDepartments = async () => {
            try {

                const res = await getAllDepartments();
                console.log("Departments API response:", res.data.dept);
                setDepartments(Array.isArray(res?.data?.dept) ? res.data.dept : []);
            } catch (err) {
                console.error(err);
                setDepartments([]);
            }
        };
        const fetchSpecializations = async () => {
            try {
                const res = await getAllSpecializations();
                console.log("specialization API response:", res);
                setSpecializations(Array.isArray(res?.data?.spec) ? res.data.spec : []);

            } catch (err) {
                console.error(err);
                setSpecializations([]);
            }
        };
        fetchDepartments();
        fetchSpecializations();
    }, [])

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // selected department is "Doctor"
    //     const isDoctorDept = Array.isArray(departments) &&
    //         departments.find(d => d._id === formData.deptId)?.dept_name === "doctor";

    //     console.log("Form submitted!", formData);

    //     const { name,
    //         email,
    //         phone,
    //         deptId,
    //         medicalLicense,
    //         expYears,
    //         specializationId } = formData;

    //     // Basic validation
    //     if (!formData.name || !formData.email || !formData.phone || !formData.deptId || !formData.expYears) {
    //         toast.error("Please fill all required fields");
    //         return;
    //     }

    //     if (isDoctorDept && (!formData.medicalLicense || !formData.specializationId)) {
    //         toast.error("Please fill medical license and specialization for doctors");
    //         return;
    //     }
    //     let result
    //     try {

    //         if (mode === "create") {
    //             // email checking
    //             const emailCheck = await EmailCheck(formData.email);
    //             console.log("Email check result:", emailCheck);
    //             if (emailCheck.status === 409) {
    //                 toast.error("Email already exists!");
    //                 return;
    //             }


    //             result = await registerStaffApi({
    //                 name,
    //                 email,
    //                 phone,
    //                 dept_id: deptId,
    //                 exp_years: expYears,
    //                 medical_license: isDoctorDept ? medicalLicense : undefined,
    //                 specialization_id: isDoctorDept ? specializationId : undefined,
    //             });


    //         } else {

    //             console.log("DEBUG: existingStaff:", existingStaff);
    //             console.log("DEBUG: existingStaff._id:", existingStaff?._id);
    //             result = await updateHospStaff(existingStaff._id, {
    //                 name,
    //                 email,
    //                 phone,
    //                 dept_id: deptId,
    //                 exp_years: expYears,
    //                 medical_license: isDoctorDept ? medicalLicense : undefined,
    //                 specialization_id: isDoctorDept ? specializationId : undefined,
    //             });
    //         }

    //         if (result.success) {

    //             if (mode === "create") {

    //                 const { tempPassword, role } = result.data;
    //                 toast.success(
    //                     `User created successfully!\nRole: ${role}\nTemp Password: ${tempPassword}`
    //                 );
    //                 setFormData({
    //                     name: "",
    //                     email: "",
    //                     phone: "",
    //                     deptId: "",
    //                     medicalLicense: "",
    //                     expYears: "",
    //                     specializationId: ""
    //                 })
    //             }

    //         } else {
    //             //  simpler toast for updates
    //             console.log("REGISTER RESULT:", result);
    //             toast.success("User updated successfully!");
    //             onClose?.(true); // notify parent for refresh
    //         }
    //         onClose?.(true);
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Something went wrong while saving data");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isDoctorDept = Array.isArray(departments) &&
            departments.find(d => d._id === formData.deptId)?.dept_name === "doctor";

        const { name, email, phone, deptId, medicalLicense, expYears, specializationId } = formData;

        // Basic validation
        if (!name || !email || !phone || !deptId || !expYears) {
            toast.error("Please fill all required fields");
            return;
        }

        if (isDoctorDept && (!medicalLicense || !specializationId)) {
            toast.error("Please fill medical license and specialization for doctors");
            return;
        }

        try {
            let result;

            if (mode === "create") {
                const emailCheck = await EmailCheck(email);
                if (emailCheck.status === 409) {
                    toast.error("Email already exists!");
                    return;
                }

                result = await registerStaffApi({
                    name,
                    email,
                    phone,
                    dept_id: deptId,
                    exp_years: expYears,
                    medical_license: isDoctorDept ? medicalLicense : undefined,
                    specialization_id: isDoctorDept ? specializationId : undefined,
                });

            } else {
                // update mode
                result = await updateHospStaff(existingStaff._id, {
                    name,
                    email,
                    phone,
                    dept_id: deptId,
                    exp_years: expYears,
                    medical_license: isDoctorDept ? medicalLicense : undefined,
                    specialization_id: isDoctorDept ? specializationId : undefined,
                });
            }

            // Handle backend response properly
            if (result.success) {
                const successMsg = mode === "create"
                    ? `User created successfully!\nRole: ${result.data.role}\nTemp Password: ${result.data.tempPassword}`
                    : "User updated successfully!";
                toast.success(successMsg);
                onClose?.(true);
            } else {
                // Show backend error message (like duplicate email)
                toast.error(result.message || "Something went wrong");
            }

        } catch (err) {
            console.error("Update Error:", err);

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Something went wrong while saving data";

            toast.error(message);
        }
    };


    return (
        <>
            {mode === "create" ? (
                <div className={`flex flex-col sm:flex-row min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Navbar />
                        <div className="flex-1 flex flex-col items-center justify-center ">
                            {/* <div className="w-full max-w-4xl p-3">
                                <FormSection />
                            </div> */}
                            <HospStaffForm
                                formData={formData}
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                mode={mode}
                                departments={departments}
                                specializations={specializations}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                // Popup/modal layout for updating
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
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

                        <HospStaffForm
                            formData={formData}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            mode={mode}
                            departments={departments}
                            specializations={specializations}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default HospStaffReg
