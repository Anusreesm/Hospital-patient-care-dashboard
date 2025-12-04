const API_URL = "https://hospital-patient-care-dashboard-backend.onrender.com/api/bloodBankReq";

// get all confirmed appointments
export const GetConfrimedAppointment = async () => {
    try {
        const token = localStorage.getItem("token"); //  JWT token
        if (!token) return { success: false, message: "User not logged in" };
        const res = await fetch(`${API_URL}/confirmed-appointments`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },

        });
        return await res.json();
    } catch (err) {
        console.error("req error:", err);
        return { success: false, message: "Network error" };
    }
};


// create req
export const CreateBloodReq = async (data) => {
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
        console.error("req  error:", err);
        return { success: false, message: "Network error" };
    }
}
// get all req
export const GetAllBloodReq = async () => {
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
        console.error("req error:", err);
        return { success: false, message: "Network error" };
    }
};

// updateReq
export const UpdateBloodReq = async (id, data) => {
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
        console.error("req error:", err);
        return { success: false, message: "Network error" };
    }
}


// Delete Req
export const DeleteBloodReq = async (id) => {
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
        console.error("req error:", err);
        return { success: false, message: "Network error" };
    }
}