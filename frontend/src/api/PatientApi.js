export const GetAllPatients = async () => {
   const res = await fetch('https://hospital-patient-care-dashboard-backend.onrender.com/api/patient/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
      //  body:JSON.stringify()
   })
   const result = await res.json()
   return result
}

export const registerPatient = async (payload) => {
   const res = await fetch('https://hospital-patient-care-dashboard-backend.onrender.com/api/patient/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
   })
   const result = await res.json()
   return result
}

export const updatePatient = async (id, data) => {
  try {
    const res = await fetch(`https://hospital-patient-care-dashboard-backend.onrender.com/api/patient/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
   const res = await fetch(`https://hospital-patient-care-dashboard-backend.onrender.com/api/patient/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }

   })
   const result = await res.json()
   return result
}

export const GetPatientsByPhoneNumber = async (phone) => {
   const res = await fetch(`https://hospital-patient-care-dashboard-backend.onrender.com/api/patient/find-by-phone/${phone}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
      //  body:JSON.stringify()
   })
   const result = await res.json()
   return result
}
