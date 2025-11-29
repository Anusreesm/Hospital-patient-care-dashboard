
const CreateRequestForm = ({
  formData,
  patients,
  setFormData,
  handleSubmit,
  mode
}) => {

  const handlePatientChange = (appointmentId) => {
    const selected = patients.find((a) => a._id === appointmentId);

    if (selected) {
      setFormData((prev) => ({
        ...prev,
        appointmentId,
        patientId: selected.patient_id?._id || "",
        userId: selected.patient_id?.user_id || "",
        doctor: selected.hosp_staff_id?.name || "",
        specz: selected.specialization_id?.spec_name || "",
        bloodType: selected.patient_id?.bloodType || ""
      }));

    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <form
      // className="max-w-xl p-4 bg-white shadow rounded space-y-4"
      className="space-y-4"
      onSubmit={handleSubmit}
    >
      {/* <h2 className="text-xl font-semibold">
        {mode === "update" ? "Update Blood Request" : "Create Blood Request"}
      </h2> */}


      {/* Patient Dropdown */}
      <div>
        <label className="block font-medium dark:text-gray-100">Select Patient</label>
        <select
          className={`border w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 p-2 rounded ${mode === "update" ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          name="appointmentId"
          value={formData.appointmentId}
          onChange={(e) => handlePatientChange(e.target.value)}
          disabled={mode === "update"}
        >
          <option value="">-- Select --</option>
          {patients.map((a) => (
            <option key={a._id} value={a._id}>
              {a.patient_id?.name}
            </option>
          ))}
        </select>

      </div>


      {/* Auto-filled Doctor Name */}
      <div>
        <label className="block font-medium mb-1">Doctor Name</label>
        <input
          type="text"
          className="border w-full p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={formData.doctor}
          disabled
        />
      </div>


      {/* Auto-filled specialization Name */}
      <div>
        <label className="block font-medium mb-1">Specialization</label>
        <input
          type="text"
          className="border w-full p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={formData.specz}
          disabled
        />
      </div>

      {/* Auto-filled Blood Type */}
      <div>
        <label className="block font-medium mb-1">Blood Type</label>
        <input
          type="text"
          className="border w-full p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={formData.bloodType}
          disabled
        />
      </div>

      {/* Units */}
      <div>
        <label className="block font-medium mb-1">Units Required</label>
        <input
          type="number"
          name="unitsRequired"
          className="border w-full p-2 rounded"
          value={formData.unitsRequired}
          onChange={handleChange}
          required
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block font-medium mb-1">Urgency Level</label>
        <select
          name="priority"
          value={formData.priority}
          className="border w-full p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          onChange={handleChange}
          required
        >
          <option value="">-- Select --</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block font-medium mb-1">Required Date</label>
        <input
          type="date"
          name="date"
          className="border w-full p-2 rounded dark:bg-gray-700"
          value={formData.date}
          onChange={handleChange}
          min={minDate}
          required
        />
      </div>

      {/* Reason */}
      <div>
        <label className="block font-medium mb-1">Reason</label>
        <textarea
          name="reason"
          className="border w-full p-2 rounded"
          rows={2}
          value={formData.reason || ""}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white w-full py-2 rounded font-semibold"

      >
        {mode === "update" ? "Update Request" : "Submit Request"}
      </button>
    </form>
  );
};

export default CreateRequestForm;
