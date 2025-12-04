const API_URL = "https://hospital-patient-care-dashboard-ve5d.onrender.com/api/deptMaster";

export const AddDepartments = async ({ dept_name }) => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ dept_name })
   })
   const result = await res.json()
   return result
}

export const getAllDepartments = async () => {
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


export const deleteDepartment = async (id) => {
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