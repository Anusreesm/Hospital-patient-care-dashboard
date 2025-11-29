

const API_URL = "https://hospital-patient-care-dashboard-backend.onrender.com/api/bloodBank";

export const GetAllBloodType = async () => {
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


// updateBloodBank
export const UpdateBloodBank= async(id,data)=>{
     try {
        const res = await fetch(`${API_URL}/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return await res.json();
    } catch (err) {
        console.error("master error:", err);
        return { success: false, message: "Network error" };
    }
}

// Delete bloodbank
export const DeleteBloodBank=async(id)=>{
     try {
        const res = await fetch(`${API_URL}/delete/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
        });
        return await res.json();
    } catch (err) {
        console.error("master error:", err);
        return { success: false, message: "Network error" };
    }
}
