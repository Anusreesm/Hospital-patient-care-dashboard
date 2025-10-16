import { useEffect, useState } from "react"
import Button from "../../Components/Button"
import Input from "../../Components/Forms/Input"

import Select from "../../Components/Forms/Select"
import { getAllDepartments } from "../../api/DeptMasterApi"
import { getAllSpecializations } from "../../api/SpecializationMasterApi"
import { RegisterHospStaff as registerStaffApi } from "../../api/HospStaff"
import Sidebar from "../../Components/Layouts/Sidebar"
import Navbar from "../../Components/Layouts/Navbar"

const HospStaffReg = () => {
    const [departments, setDepartments] = useState([]);
    const [specializations, setSpecializations] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        deptId: "",
        medicalLicense: "",
        expYears: "",
        specializationId: ""
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



    const handleSubmit = async (e) => {
        e.preventDefault();
        // selected department is "Doctor"
        const isDoctorDept = Array.isArray(departments) &&
            departments.find(d => d._id === formData.deptId)?.dept_name === "Doctor";
        console.log("Form submitted!", formData);

        const { name,
            email,
            phone,
            deptId,
            medicalLicense,
            expYears,
            specializationId } = formData;

        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.deptId || !formData.expYears) {
            alert("Please fill all required fields");
            return;
        }

        if (isDoctorDept && (!formData.medicalLicense || !formData.specializationId)) {
            alert("Please fill medical license and specialization for doctors");
            return;
        }
        const result = await registerStaffApi({
            name,
            email,
            phone,
            dept_id: deptId,
            exp_years: expYears,
            medical_license: isDoctorDept ? medicalLicense : undefined,
            specialization_id: isDoctorDept ? specializationId : undefined,
        });

        if (result.success) {
          const { tempPassword, role } = result.data;
        alert(`Hospital staff created successfully!\nRole: ${role}\nTemp Password: ${tempPassword}`);
        setFormData({
            name: "",
            email: "",
            phone: "",
            deptId: "",
            medicalLicense: "",
            expYears: "",
            specializationId: ""
        })
        } else {
            alert(result.message || "Failed to create staff");
        }
    }


    return (
       <>
      <div className="flex h-screen">
      <Sidebar/>
       <div className="flex-1 flex flex-col">
        <Navbar/>
        <div className="flex-1 flex flex-col items-center justify-center ">
            <div className="w-full max-w-4xl p-3">
                <form className="rounded-lg border  text-gray-900 shadow-sm w-full max-w-4xl p-8 " onSubmit={handleSubmit} >
                    <div className="mb-6 flex flex-col gap-2 items-center">
                        <p className="text-2xl font-semibold text-black">Create New User</p>
                        <span className="text-gray-400 text-sm">Add a new user to hospital system</span>
                    </div>

                    {/* name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-9">
                        <div>
                            <p className="font-bold text-black">Full Name</p>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* email  */}
                        <div>
                            <p className="font-bold text-black">Email</p>
                            <Input
                                type="email"
                                name="email"
                                placeholder="enter email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* phone number */}
                        <div>
                            <p className="font-bold text-black">Phone</p>
                            <Input
                                type="text"
                                name="phone"
                                placeholder="enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* department */}
                        <div>
                            <p className="font-bold text-black">Department</p>
                            <Select
                                name="deptId"
                                value={formData.deptId}
                                onChange={handleChange}
                                placeholder="Select department"
                                required
                            >
                                <option></option>
                                {departments.map((d) => (
                                    <option key={d._id} value={d._id}>
                                        {d.dept_name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* experience */}
                        <div>
                            <p className="font-bold text-black">Years of Experience</p>
                            <Input
                                type="text"
                                name="expYears"
                                placeholder="10"
                                value={formData.expYears}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* license number */}
                        <div>
                            <p className="font-bold text-black">License Number</p>
                            <Input
                                type="text"
                                name="medicalLicense"
                                placeholder="MD12345"
                                value={formData.medicalLicense}
                                onChange={handleChange}
                            />
                        </div>


                        {/* specialization */}
                        <div>
                            <p className="font-bold text-black">Specialization</p>
                            <Select
                                name="specializationId"
                                value={formData.specializationId}
                                onChange={handleChange}
                                placeholder="Select specialization"
                            >
                                <option></option>
                                {specializations.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.spec_name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                    </div>
                    <Button type="submit"
                        className="mt-8" >
                        Add User
                    </Button>
                </form>
            </div>
        </div>
        </div>
        </div>
       </>
    )
}

export default HospStaffReg
