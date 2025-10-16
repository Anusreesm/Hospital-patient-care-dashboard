import { useEffect, useState } from "react";
import Navbar from "../../Components/Layouts/Navbar"
import Sidebar from "../../Components/Layouts/Sidebar"
import Input from "../../Components/Forms/Input";

import { AddSpecializations, deleteSpecialization, getAllSpecializations } from "../../api/SpecializationMasterApi";
import { verifyDelete } from "../../Utils/Alerts/ErrorAlert";
import { DeleteItems } from "../../Utils/Alerts/SuccessAlert";

const SpeczMaster = () => {
    const [specializations, setSpecialization] = useState([]);
    const [speczName, setSpeczName] = useState("");
    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const res = await getAllSpecializations();
                console.log(res)
                console.log(res.data.spec[0].spec_name);
                setSpecialization(Array.isArray(res?.data?.spec) ? res.data.spec : []);
            } catch (err) {
                console.error("Error fetching specializations:", err);
                setSpecialization([]);
            }
        };

        fetchSpecializations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!speczName.trim()) return;
        try {
            const res = await AddSpecializations({ spec_name: speczName });
            if (res.success) {
                setSpecialization((prev) => [...prev, res.data]);
                setSpeczName("");
            } else {
                alert(res.message || "Failed to add specialization");
            }
        } catch (error) {
            console.error("Error adding specialization:", error);
        }
    };
    const handleDelete = async (id) => {
        // confirmation
        const confirmed = await verifyDelete("specialization");
        if (!confirmed) return;
        try {
            const res = await deleteSpecialization(id);
            if (res.success) {
                setSpecialization((prev) => prev.filter((spec) => spec._id !== id));
                // success toast
                DeleteItems("specialization");
            } else {
                alert(res.message || "Failed to delete specialization");
            }
        } catch (err) {
            console.error("Error deleting specialization:", err);
        }
    };
    return (
        <>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <div className="p-6  flex-1">
                        {/* Form section */}
                        <form className="flex items-center gap-4 mb-6" onSubmit={handleSubmit}>
                            <Input
                                type="text"
                                value={speczName}
                                onChange={(e) => setSpeczName(e.target.value)}
                                placeholder="Enter Specialization Name"
                                className="border border-gray-300 rounded-md p-2 w-1/3"
                                required


                            />
                            <button type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                Add
                            </button>
                        </form>

                        {/* Table section */}
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="py-2 px-4 text-left">#</th>
                                    <th className="py-2 px-4 text-left">Specialization Name</th>
                                    <th className="py-2 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    specializations.map((spec, index) => (
                                        <tr key={spec._id} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-4">{index + 1}</td>
                                            <td className="py-2 px-4">{spec.spec_name}</td>
                                            <td className="py-2 px-4">
                                                <button
                                                    onClick={() => handleDelete(spec._id)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
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
        </>
    );
};
export default SpeczMaster