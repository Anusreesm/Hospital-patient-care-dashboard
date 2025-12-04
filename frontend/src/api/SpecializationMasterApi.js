
const API_URL = "https://hospital-patient-care-dashboard-ve5d.onrender.com/api/specializationMaster";


export const AddSpecializations = async ({ spec_name }) => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ spec_name })
   })
   const result = await res.json()
   return result
}

export const getAllSpecializations = async () => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },

   })
   const result = await res.json()
   return result
}

export const deleteSpecialization = async (id) => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },

   })
   const result = await res.json()
   return result
}