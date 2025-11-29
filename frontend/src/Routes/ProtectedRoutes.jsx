import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoutes=({children, allowedRoles})=>{
    const {token, userRole}=useAuth();
  if(!token) return <Navigate to ="/"/>
// role based access control
if(allowedRoles && !allowedRoles.includes(userRole))
{
    return <Navigate to ="/"/>
}
    return children;
}
export default ProtectedRoutes