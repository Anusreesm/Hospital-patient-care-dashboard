
import { GetPatientsByPhoneNumber } from "../../../api/PatientApi";
import Input from "../../../Components/Forms/Input"
import { useTheme } from "../../../Context/ThemeContext";

const PatientCreateForm = ({
    formData,
    handleSubmit,
    setFormData,
    mode = "create",
    countries,
    states
}) => {

    const { theme } = useTheme()
    console.log(theme)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneLookup = async (e) => {
        const phone = e.target.value;

        if (mode !== "create" || phone.length < 10) return;

        try {
            // Add +91 if missing
            const lookupPhone = phone.startsWith('+91') ? phone : '+91' + phone.slice(-10);
            const res = await GetPatientsByPhoneNumber(lookupPhone);

            if (res.success && res.data.exists && res.data.patient) {
                const p = res.data.patient;
                setFormData(prev => ({
                    ...prev,
                    fullName: p.name || "",
                    age: p.age || "",
                    gender: p.gender || "",
                    bloodType: p.bloodType || "",
                    emergencyName: p.emergency_name || "",
                    emergencyContact: p.emergency_contact || "",
                    street: p.addresses_id?.street || "",
                    city: p.addresses_id?.city || "",
                    country: p.addresses_id?.country || "",
                    state: p.addresses_id?.state || "",
                    pincode: p.addresses_id?.pincode || "",
                    email: p.user_id?.email || "",
                    patientExists: true,
                    existingEmail: p.user_id?.email || ""
                }));
            } else {

                setFormData(prev => ({
                    ...prev,
                    fullName: "",
                    age: "",
                    gender: "",
                    bloodType: "",
                    emergencyName: "",
                    emergencyContact: "",
                    street: "",
                    city: "",
                    country: "",
                    state: "",
                    pincode: "",
                    email: "",
                    patientExists: false,
                    existingEmail: ""
                }));
            }
        } catch (err) {
            console.error("Patient lookup error:", err);
        }
    };


    return (
        <>
            {/* <div className="w-full sm:w-11/12 flex justify-center p-4 sm:p-4 dark:bg-gray-900 "> */}
            <div className="w-full flex justify-center p-2 sm:p-4 dark:bg-gray-900">
                <form
                    className={`w-full sm:w-11/12 max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl
                p-4 sm:p-6 grid grid-cols-1 gap-4 md:grid-cols-2
                max-h-[90vh] overflow-y-auto`}
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-xl sm:text-2xl font-semibold col-span-1 md:col-span-2 dark:text-white text-center">
                        Patient Registration
                    </h2>

                    {/* FULL NAME  */}
                    <Input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        placeholder="Full Name"
                        className="border p-2 w-full rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={handleChange}
                        required
                    />

                    {/* PHONE */}
                    <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        placeholder="Phone"
                        className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={(e) => {
                            handleChange(e);       // normal update
                            handlePhoneLookup(e);  // auto lookup
                        }}
                        required
                    />

                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="email"
                        className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={handleChange}
                        required
                    />
                    {/* AGE */}
                    <Input
                        type="number"
                        name="age"
                        value={formData.age}
                        placeholder="Age"
                        className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={handleChange}
                        required
                    />

                    {/* GENDER */}
                    <select
                        name="gender"
                        value={formData.gender}
                        className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                    </select>

                    {/* BLOOD TYPE */}
                    <select
                        name="bloodType"
                        value={formData.bloodType}
                        className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Blood Type</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    {/* EMERGENCY NAME */}
                    <Input
                        type="text"
                        name="emergencyName"
                        value={formData.emergencyName}
                        placeholder="Emergency Contact Name"
                        className="border p-2 rounded"
                        onChange={handleChange} />

                    {/* EMERGENCY CONTACT */}
                    <Input
                        type="tel"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        placeholder="Emergency Contact Number"
                        className="border p-2 rounded"
                        onChange={handleChange} />

                    {/* REGISTRATION DATE */}
                    <Input
                        type="date"
                        name="registrationDate"
                        value={formData.registrationDate}
                        className="border p-2 rounded"
                        onChange={handleChange}
                        disabled={mode === "create"}
                    />


                    {/* MEDICAL CONDITION */}
                    <Input
                        type="text"
                        name="medicalCondition"
                        value={formData.medicalCondition}
                        placeholder="Medical Condition"
                        className="border p-2 rounded"
                        onChange={handleChange}
                    />

                    {/* ALLERGIES */}
                    <Input
                        type="text"
                        name="allergies"
                        value={formData.allergies}
                        placeholder="Allergies"
                        className="border p-2 rounded"
                        onChange={handleChange} />

                    {/* STREET */}
                    <Input
                        type="text"
                        name="street"
                        value={formData.street}
                        placeholder="Street"
                        className="border p-2 rounded"
                        onChange={handleChange} />

                    {/* CITY */}
                    <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        placeholder="City"
                        className="border p-2 rounded"
                        onChange={handleChange} />

                    {/* Country Dropdown */}
                    <select
                        name="country"
                        value={formData.country}
                        className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                            <option key={c.iso3} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* State Dropdown */}
                    <select
                        name="state"
                        value={formData.state}
                        className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>

                    {/* PINCODE */}
                    <Input
                        type="number"
                        name="pincode"
                        value={formData.pincode}
                        placeholder="Pincode"
                        className="border p-2 rounded"
                        onChange={handleChange} />

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="col-span-1 md:col-span-2 bg-blue-600 text-white p-2 rounded-xl mt-3">
                        {mode === "create" ? "Register" : "Save Changes"}
                    </button>
                </form>
            </div>

        </>
    )
}
export default PatientCreateForm