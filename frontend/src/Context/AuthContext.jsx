import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useState } from "react"

const AuthContext = createContext()
// provider component
// to wrap  app and give access to values put inside AuthContext.Provider.
export const AuthProvider = ({ children }) => {
const[auth, setAuth]=useState(
    {
        token:null,
        userRole:null,
        userId:null
    }
)
    const LoginHandler = (data) => {
        const {token} =data
        // to create token on localstorage
        localStorage.setItem('token',token)
        const decodeToken= token? jwtDecode(token):null
        const userRole= decodeToken?.role
        const userId= decodeToken?.id
        // since it contains same name as it is given in state and variable
        setAuth(
            {
                token,userRole,userId
            }
        )
    }
    const LogoutHandler = () => {

    }

    console.log(auth,":auth")
    return (
        // to get values to different components
        <AuthContext.Provider value={{
             LoginHandler, 
             LogoutHandler,
             ...auth

         }}>
            {children}
        </AuthContext.Provider>
    )
}
// custom hook
export const useAuth = () => useContext(AuthContext)