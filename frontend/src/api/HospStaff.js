export const RegisterHospStaff = async ({ email, dept_id, name, phone, medical_license, exp_years, specialization_id }) => {

   try {
      const res = await fetch('https://hospital-patient-care-dashboard-backend.onrender.com/api/hospStaff/register', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
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
   const res = await fetch('https://hospital-patient-care-dashboard-backend.onrender.com/api/hospStaff/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
      //  body:JSON.stringify()
   })
   const result = await res.json()
   return result
}

export const getHospStaffById = async (id) => {
   const res = await fetch(`https://hospital-patient-care-dashboard-backend.onrender.com/api/hospStaff/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
      // body: JSON.stringify()
   })
   const result = await res.json()
   return result
}

export const deleteHospStaff = async (id) => {
   const res = await fetch(`https://hospital-patient-care-dashboard-backend.onrender.com/api/hospStaff/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }

   })
   const result = await res.json()
   return result
}


export const updateHospStaff = async (id, { dept_id, name, phone, medical_license, exp_years, specialization_id, email }) => {
   const res = await fetch(`https://hospital-patient-care-dashboard-backend.onrender.com/api/hospStaff/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dept_id, name, phone, medical_license, exp_years, specialization_id, email })
   })
   const result = await res.json()
   return result
}