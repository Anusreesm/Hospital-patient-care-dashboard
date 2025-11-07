import React from "react";

import Input from "../../../Components/Forms/Input";
import Select from "../../../Components/Forms/Select";
import Button from "../../../Components/Button";

const HospStaffForm = ({
    formData,
    handleChange,
    handleSubmit,
    mode = "create",
    departments,
    specializations,
}) => (
   
    <form
        className="rounded-lg border text-gray-900 shadow-sm w-full max-w-4xl p-8"
        onSubmit={handleSubmit}
    >
         
        <div className="mb-6 flex flex-col gap-2 items-center">
            <p className="text-2xl font-semibold text-black">
                {mode === "create" ? "Create New User" : "Update User Details"}
            </p>
            <span className="text-gray-400 text-sm">
                {mode === "create"
                    ? "Add a new user to hospital system"
                    : "Modify existing user information"}
            </span>
        </div>

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
            <div>
                <p className="font-bold text-black">Email</p>
                <Input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <p className="font-bold text-black">Phone</p>
                <Input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <p className="font-bold text-black">Department</p>
                <Select
                    name="deptId"
                    value={formData.deptId}
                    onChange={handleChange}
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
            <div>
                <p className="font-bold text-black">Specialization</p>
                <Select
                    name="specializationId"
                    value={formData.specializationId}
                    onChange={handleChange}
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

        <Button type="submit" className="mt-8">
            {mode === "create" ? "Add User" : "Save Changes"}
        </Button>
    </form>
);

export default React.memo(HospStaffForm);
