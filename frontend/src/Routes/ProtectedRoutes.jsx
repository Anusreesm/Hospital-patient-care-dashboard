import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoutes=({children, allowedRoles})=>{
    const {token, userRole}=useAuth();
  if(!token) return <Navigate to ="/login"/>
// role based access control
if(allowedRoles && !allowedRoles.includes(userRole))
{
    return <Navigate to ="/login"/>
}
    return children;
}
export default ProtectedRoutes