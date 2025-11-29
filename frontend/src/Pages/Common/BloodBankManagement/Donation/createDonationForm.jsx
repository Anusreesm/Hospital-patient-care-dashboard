

const CreateDonationForm = ({ formData,
  handleSubmit,
  setFormData,
  mode = "create" }) => {

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Prevent selecting past dates
  const minDate = new Date().toISOString().split("T")[0];
return (
    <div className="flex justify-center items-center p-4  dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 dark:bg-gray-900 ">

        {/* Donor Name */}
        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-100">Donor Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter donor name"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="font-medium mb-1 dark:text-gray-100 text-gray-700">Phone Number</label>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="10-digit number"
            required
          />
        </div>

        {/* Blood Type */}
        <div className="flex flex-col">
          <label className="font-medium mb-1 dark:text-gray-100 text-gray-700">Blood Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none"
            required
          >
            <option value="">Select...</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Available Units */}
        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-100">Available Units</label>
          <input
            type="number"
            name="availableUnits"
            value={formData.availableUnits}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Units"
            min="1"
            required
          />
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="font-medium mb-1 dark:text-gray-100 text-gray-700">Donation Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-700"
            min={minDate}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-lg text-lg font-semibold transition-all"
        >
          {mode === "create" ? "Submit Donation" : "Save Changes"}
        </button>

      </form>
    </div>
  );
};
export default CreateDonationForm;
