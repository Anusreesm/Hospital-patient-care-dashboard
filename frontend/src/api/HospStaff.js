const API_URL = "https://hospital-patient-care-dashboard-backend.onrender.com/api/hospStaff";



export const RegisterHospStaff = async ({ email, dept_id, name, phone, medical_license, exp_years, specialization_id }) => {

   try {
      const token = localStorage.getItem("token"); //  JWT token
      if (!token) return { success: false, message: "User not logged in" };
      const res = await fetch(`${API_URL}/register`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${token}`},
         body: JSON.stringify({ email, dept_id, name, phone, medical_license, exp_years, specialization_id })


      })
      console.log("RegisterHospStaff sending:", { email, dept_id, name, phone, medical_license, exp_years, specialization_id });
      const result = await res.json()
      return result
   }
   catch (err) {
      console.error("RegisterHospStaff API error:", err);
      return { success: false, message: "Network error" };
   }
}

export const GetAllHospStaff = async () => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${token}`}

   })
   const result = await res.json()
   return result
}

export const getHospStaffById = async (id) => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${token}`}

   })
   const result = await res.json()
   return result
}

export const deleteHospStaff = async (id) => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${token}`}

   })
   const result = await res.json()
   return result
}


export const updateHospStaff = async (id, { dept_id, name, phone, medical_license, exp_years, specialization_id, email }) => {
   const token = localStorage.getItem("token"); //  JWT token
   if (!token) return { success: false, message: "User not logged in" };
   const res = await fetch(`${API_URL}/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' ,
                'Authorization': `Bearer ${token}`},
      body: JSON.stringify({ dept_id, name, phone, medical_license, exp_years, specialization_id, email })
   })
   const result = await res.json()
   return result
}