const API_URL = "http://localhost:3000/api/appointment";

export const BookAppointment = async (data) => {
    try {
        const res = await fetch(`${API_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
        const res = await fetch(`${API_URL}/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
           
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
    const res = await fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (err) {
    console.error("DeleteAppointment error:", err);
    return { success: false, message: "Server error" };
  }
};


export const GetAllAppointmentById = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
        });
        return await res.json();
    } catch (err) {
        console.error("GetAppointment By Id error:", err);
        return { success: false, message: "Network error" };
    }
};