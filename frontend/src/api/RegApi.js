const API_URL = "https://hospital-patient-care-dashboard-backend.onrender.com/api/registration";

export const GetAllReg = async () => {
    try {
        const res = await fetch(`${API_URL}/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
        });
        return await res.json();
    } catch (err) {
        console.error("Registration error:", err);
        return { success: false, message: "Network error" };
    }
};