// const API_URL = "https://hospital-patient-care-dashboard-backend.onrender.com/api/appointment";
const API_URL = "https://hospital-patient-care-dashboard-backend.onrender.com/api/appointment";

export const BookAppointment = async (data) => {
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
    return await res.json();
  } catch (err) {
    console.error("BookAppointment error:", err);
    return { success: false, message: "Network error" };
  }
};


export const GetAllAppointment = async () => {
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
    console.error("BookAppointment error:", err);
    return { success: false, message: "Network error" };
  }
};
// discharge
export const CompleteAppointment = async (id) => {
  try {
    const token = localStorage.getItem("token"); //  JWT token
    if (!token) return { success: false, message: "User not logged in" };
    const res = await fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: "completed" }),
    });
    return await res.json();
  } catch (err) {
    console.error("CompleteAppointment error:", err);
    return { success: false, message: "Error completing appointment" };
  }
};

export const UpdateAppointment = async (id, data) => {
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
    console.error("UpdateAppointment error:", err);
    return { success: false, message: "Error updating appointment" };
  }
};

export const DeleteAppointment = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { success: false, message: "User not logged in" };
    const res = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    console.error("DeleteAppointment error:", err);
    return { success: false, message: "Server error" };
  }
};


export const GetAllAppointmentById = async (id) => {
  try {
    const token = localStorage.getItem("token"); //  JWT token
    if (!token) return { success: false, message: "User not logged in" };
    const res = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },

    });
    return await res.json();
  } catch (err) {
    console.error("GetAppointment By Id error:", err);
    return { success: false, message: "Network error" };
  }
};