import { useState } from "react";
import Navbar from "../../../../Components/Layouts/Navbar";
import Sidebar from "../../../../Components/Layouts/Sidebar";
import toast from "react-hot-toast";
import { CreateDonor, UpdateDonor } from "../../../../api/BloodBankDonorApi";
import CreateDonationForm from "./createDonationForm";
import { useTheme } from "../../../../Context/ThemeContext";


const CreateDonation = ({ mode = "create", existingDonor = null, onClose, onRefresh }) => {
 const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: existingDonor?.donor_name || "",
    phone: existingDonor?.phone || "",
    type: existingDonor?.blood_type || "",
    availableUnits: existingDonor?.available_unit || "",
    date: existingDonor?.date ? existingDonor.date.split("T")[0] : "" 
  });

  // create donation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, type, availableUnits, date } = formData;
    if (!name || !phone || !type || !availableUnits || !date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // creation
      if (mode === "create") {
        const donorData = {
          donor_name: name,
          phone,
          blood_type: type,
          available_unit: availableUnits,
          date
        }
        const res = await CreateDonor(donorData);
        if (!res?.success) {
          toast.error(res?.message || "Failed to schedule donor");
          return;
        }

        toast.success("Donor scheduled successfully");
        setFormData({
          name: "",
          phone: "",
          type: "",
          availableUnits: "",
          date: ""
        });
        onClose?.();
        return;
      }
      // updation
      if (mode === "update") {
        const updatedData = {
          donor_name: name,
          phone,
          blood_type: type,
          available_unit: availableUnits,
          date
        };

        const updatedId = existingDonor._id;

        if (!updatedId) {
          toast.error("Donor ID missing");
          return;
        }
        const res = await UpdateDonor(updatedId, updatedData)
        if (!res?.success) {
          toast.error(res?.message || "Failed to update Donor");
          return;
        }
        toast.success("Donor updated successfully");

        onRefresh?.();
        onClose?.();    // close modal
        return
      }

    }

    catch (err) {
      console.error("Error while scheduling donation:", err);
      toast.error("Something went wrong");
    }

  }

  return (
    <>
      {mode === "create" ? (
        <div className={`flex flex-col sm:flex-row min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"}`}>
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="bg-white bg-opacity-90 backdrop-blur-md shadow-2xl dark:bg-gray-900 rounded-2xl p-8 w-full max-w-lg">
                <h1 className="text-2xl dark:text-gray-100 font-bold text-gray-700 mb-6 text-center">
                  Add New Donation
                </h1>
                <CreateDonationForm
                  formData={formData}
                  handleSubmit={handleSubmit}
                  setFormData={setFormData}
                  mode={mode}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Popup/modal layout for updating
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <div className={`bg-white ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"} rounded-2xl shadow-lg p-8 w-full max-w-3xl relative`}>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
            <CreateDonationForm
              formData={formData}
              handleSubmit={handleSubmit}
              setFormData={setFormData}
              mode={mode}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default CreateDonation;
