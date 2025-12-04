const API_URL = "https://hospital-patient-care-dashboard-backend.onrender.com/api/bloodBankDonor";

//create donor
export const CreateDonor = async (data) => {
    try {
        const token = localStorage.getItem("token"); //  JWT token
        if (!token) return { success: false, message: "User not logged in" };
        const res = await fetch(`${API_URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        return result;
    }
    catch (err) {
        console.error("donor  error:", err);
        return { success: false, message: "Network error" };
    }
}

// get all donors
export const GetAllDonors = async () => {
    try {
        const token = localStorage.getItem("token"); //  JWT token
        if (!token) return { success: false, message: "User not logged in" };
        const res = await fetch(`${API_URL}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },

        });
        return await res.json();
    } catch (err) {
        console.error("donor error:", err);
        return { success: false, message: "Network error" };
    }
};

// updateDonor
export const UpdateDonor = async (id, data) => {
    try {
        const token = localStorage.getItem("token"); //  JWT token
        if (!token) return { success: false, message: "User not logged in" };
        const res = await fetch(`${API_URL}/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        return await res.json();
    } catch (err) {
        console.error("donor error:", err);
        return { success: false, message: "Network error" };
    }
}

// Delete donor
export const DeleteDonor = async (id) => {
    try {
        const token = localStorage.getItem("token"); //  JWT token
        if (!token) return { success: false, message: "User not logged in" };
        const res = await fetch(`${API_URL}/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },

        });
        return await res.json();
    } catch (err) {
        console.error("donor error:", err);
        return { success: false, message: "Network error" };
    }
}


