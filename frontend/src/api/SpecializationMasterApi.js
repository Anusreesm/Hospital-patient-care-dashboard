export const AddSpecializations= async({spec_name})=>{
 const res=await fetch('http://localhost:3000/api/specializationMaster/create',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({spec_name})
 })
 const result= await res.json()
 return result
}

export const getAllSpecializations= async()=>{
 const res=await fetch('http://localhost:3000/api/specializationMaster/',{
   method:'GET',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify()
 })
  const result= await res.json()
 return result
}

export const deleteSpecialization = async (id) => {
   const res = await fetch(`http://localhost:3000/api/specializationMaster/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
   })
   const result = await res.json()
   return result
}