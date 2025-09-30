import { useAuth } from "../Context/AuthContext";

const ProtectedRoutes=({children, allowedRoles})=>{
    const {token,userRole}=useAuth()
    const roles=allowedRoles.includes(allowedRoles)
  
    console.log(userRole,"test")

    return children;
}
export default ProtectedRoutes