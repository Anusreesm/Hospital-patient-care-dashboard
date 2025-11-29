export const AddSpecializations= async({spec_name})=>{
 const res=await fetch('https://hospital-patient-care-dashboard-backend.onrender.com/api/specializationMaster/create',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({spec_name})
 })
 const result= await res.json()
 return result
}

export const getAllSpecializations= async()=>{
 const res=await fetch('https://hospital-patient-care-dashboard-backend.onrender.com/api/specializationMaster/',{
   method:'GET',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify()
 })
  const result= await res.json()
 return result
}

export const deleteSpecialization = async (id) => {
   const res = await fetch(`https://hospital-patient-care-dashboard-backend.onrender.com/api/specializationMaster/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
   })
   const result = await res.json()
   return result
}