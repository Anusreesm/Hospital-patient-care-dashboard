const API_URL = "https://hospital-patient-care-dashboard-ve5d.onrender.com/api/payment";

export const createPayment = async (data) => {
  try {
    const token = localStorage.getItem("token"); //  JWT token
    if (!token) return { success: false, message: "User not logged in" };
    const res = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json",
                'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Payment API Error:", result);
      return null;
    }

    return result.data; // { id, url }
  } catch (err) {
    console.error("createPayment error:", err);
    return null;
  }
};

export const successPayment = async (session_id) => {
  try {
    const token = localStorage.getItem("token"); //  JWT token
    if (!token) return { success: false, message: "User not logged in" };
    const res = await fetch(`${API_URL}/success?session_id=${session_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },

    })
    return await res.json();
  } catch (err) {
    console.error("success payment error:", err);
    return { success: false, message: "Network error" };
  }
}

export const cancelPayment = async (payment_id) => {
  try {
    const token = localStorage.getItem("token"); //  JWT token
    if (!token) return { success: false, message: "User not logged in" };
    const res = await fetch(`${API_URL}/cancel?payment_id=${payment_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },

    })
    return await res.json();
  }
  catch (err) {
    console.error("canceled payment error:", err);
    return { success: false, message: "Network error" };
  }
}


export const GetAllPayments = async () => {
  try {
    const token = localStorage.getItem("token"); //  JWT token
    if (!token) return { success: false, message: "User not logged in" };
    const res = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json",
                'Authorization': `Bearer ${token}` },

    });
    return await res.json();
  } catch (err) {
    console.error("Payment error:", err);
    return { success: false, message: "Network error" };
  }
};
