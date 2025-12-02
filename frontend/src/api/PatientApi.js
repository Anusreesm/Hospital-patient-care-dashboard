const API_URL = "https://hospital-patient-care-dashboard-backend.onrender.com/api/patient";


export const GetAllPatients = async () => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` }
   })
   const result = await res.json()
   return result
}

export const registerPatient = async (payload) => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload),
   })
   const result = await res.json()
   return result
}

export const updatePatient = async (id, data) => {
   try {
      const token = localStorage.getItem("token"); //  JWT token
      if (!token) return { success: false, message: "User not logged in" };
      const res = await fetch(`${API_URL}/update/${id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
          },
         body: JSON.stringify(data),
      });
      const json = await res.json();
      return json;
   } catch (err) {
      console.error("update patient error:", err);
      return { success: false, message: "Error updating patient" };
   }
};


export const deletePatient = async (id) => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` }

   })
   const result = await res.json()
   return result
}

export const GetPatientsByPhoneNumber = async (phone) => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/find-by-phone/${phone}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` }
   })
   const result = await res.json()
   return result
}
