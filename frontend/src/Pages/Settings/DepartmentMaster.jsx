import { useEffect, useState } from "react";
import Navbar from "../../Components/Layouts/Navbar"
import Sidebar from "../../Components/Layouts/Sidebar"
import { AddDepartments, deleteDepartment, getAllDepartments } from "../../api/DeptMasterApi";
import Input from "../../Components/Forms/Input";
import { DeleteItems } from "../../Utils/Alerts/SuccessAlert";
import { verifyDelete } from "../../Utils/Alerts/ErrorAlert";
import toast from "react-hot-toast";
import PageWrapper from "../../Components/pageWrappers";



const DeptMaster = () => {
    const [departments, setDepartments] = useState([]);
    const [deptName, setDeptName] = useState("");
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await getAllDepartments();
                console.log(res.data.dept[0].dept_name);
                setDepartments(Array.isArray(res?.data?.dept) ? res.data.dept : []);
            } catch (err) {
                toast.error("Error fetching departments:", err);
                setDepartments([]);
            }
        };

        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!deptName.trim()) return;

        try {
            const res = await AddDepartments({ dept_name: deptName });
            if (res.success) {
                setDepartments((prev) => [...prev, res.data]);
                setDeptName("");
            } else {
                toast.error(res.message || "Failed to add department");
            }
        } catch (error) {
            toast.error("Error adding department:", error);
        }
    };


    const handleDelete = async (id) => {
        // confirmation
        const confirmed = await verifyDelete("department");
        if (!confirmed) return;
        try {
            const res = await deleteDepartment(id);
            if (res.success) {
                setDepartments((prev) => prev.filter((dept) => dept._id !== id));
                // success toast
                DeleteItems("Department");
            } else {
                toast.error(res.message || "Failed to delete department");
            }
        } catch (err) {
            toast.error("Error deleting department:", err);
        }
    };

    return (
        <>
            <PageWrapper>
                <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Navbar />
                        <div className="p-6  flex-1">
                            {/* Form section */}
                            <form className="flex items-center gap-4 mb-6" onSubmit={handleSubmit}>
                                <Input
                                    type="text"
                                    value={deptName}
                                    onChange={(e) => setDeptName(e.target.value)}
                                    placeholder="Enter Department Name"
                                    className="
        border border-gray-300 rounded-md p-2 w-1/3
        bg-white text-gray-900
        dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600   
    "
                                    required
                                />
                                <button
                                    type="submit"
                                    className=" bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition
        dark:bg-blue-600 dark:hover:bg-blue-700  ">
                                    Add
                                </button>
                            </form>

                            {/* Table section */}
                           <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <thead>
                                  <tr className="bg-blue-100 dark:bg-gray-700">
                                        <th className="py-2 px-4 text-left text-gray-900 dark:text-gray-100">#</th>
                                        <th className="py-2 px-4 text-left text-gray-900 dark:text-gray-100">Department Name</th>
                                        <th className="py-2 px-4 text-left text-gray-900 dark:text-gray-100">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.map((dept, index) => (
                                        <tr key={dept._id}  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">    
                                            <td className="py-2 px-4 text-gray-900 dark:text-gray-100">{index + 1}</td>
                                            <td className="py-2 px-4 text-gray-900 dark:text-gray-100">{dept.dept_name}</td>
                                            <td className="py-2 px-4">
                                                <button
                                                    onClick={() => handleDelete(dept._id)}
                                                    className=" bg-blue-500 text-white px-3 py-1 rounded 
                            hover:bg-red-600 transition cursor-pointer
                            dark:bg-blue-600 dark:hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </PageWrapper>
        </>
    );
};

export default DeptMaster