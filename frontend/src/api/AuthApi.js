export const LoginUser= async({email,password})=>{
 const res=await fetch('http://localhost:3000/api/users/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
 })
 const result= await res.json()
 return result
}

export const ChangeStatus= async({id})=>{
   const res = await fetch(`http://localhost:3000/api/users/status/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ status }),
   })
   const result = await res.json()
   return result
}

export const GetAllUsers= async()=>{
   const res = await fetch(`http://localhost:3000/api/users/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
   })
   const result = await res.json()
   return result
}

export const deleteUser = async (id) => {
   const res = await fetch(`http://localhost:3000/api/users/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
   })
   const result = await res.json()
   return result
}