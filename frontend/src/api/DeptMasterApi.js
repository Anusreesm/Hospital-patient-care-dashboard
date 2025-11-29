export const AddDepartments = async ({ dept_name }) => {
   const res = await fetch('https://hospital-patient-care-dashboard-backend.onrender.com/api/deptMaster/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dept_name })
   })
   const result = await res.json()
   return result
}

export const getAllDepartments = async () => {
   const res = await fetch('https://hospital-patient-care-dashboard-backend.onrender.com/api/deptMaster/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
   })
   const result = await res.json()
   return result
}


export const deleteDepartment = async (id) => {
   const res = await fetch(`https://hospital-patient-care-dashboard-backend.onrender.com/api/deptMaster/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
   })
   const result = await res.json()
   return result
}