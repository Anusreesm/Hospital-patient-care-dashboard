export const GetAllPatients = async () => {
   const res = await fetch('http://localhost:3000/api/patient/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
      //  body:JSON.stringify()
   })
   const result = await res.json()
   return result
}