export const RegisterHospStaff= async({email, dept_id, name, phone, medical_license, exp_years, specialization_id})=>{
 const res=await fetch('http://localhost:3000/api/hospStaff/register',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email, dept_id, name, phone, medical_license, exp_years, specialization_id})
 })
 const result= await res.json()
 return result
}