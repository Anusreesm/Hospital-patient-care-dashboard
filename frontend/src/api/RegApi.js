const API_URL = "https://hospital-patient-care-dashboard-ve5d.onrender.com/api/registration";

export const GetAllReg = async () => {
    try {
        const token = localStorage.getItem("token"); //  JWT token
        if (!token) return { success: false, message: "User not logged in" };
        const res = await fetch(`${API_URL}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }

        });
        return await res.json();
    } catch (err) {
        console.error("Registration error:", err);
        return { success: false, message: "Network error" };
    }
};