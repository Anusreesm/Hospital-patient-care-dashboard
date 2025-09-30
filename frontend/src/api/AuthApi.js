export const LoginUser= async({email,password})=>{
 const res=await fetch('http://localhost:3000/api/users/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
 })
 const result= await res.json()
 return result
}