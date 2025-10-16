import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()
const getDecodeToken = (token) => {
    try {
        return token ? jwtDecode(token) : null;
    }
    catch (error) {
        console.error("Invalid Token: ", error);
        return null;
    }
}

// provider component
// to wrap  app and give access to values put inside AuthContext.Provider.
export const AuthProvider = ({ children }) => {
    const storedToken = localStorage.getItem("token");
    const decoded = getDecodeToken(storedToken);
// Reads token from localStorage on page reload.
    const [auth, setAuth] = useState(
        {
            token: storedToken || null,
            userRole: decoded?.role || null,
            userId: decoded?.id || null,
            userName: decoded?.name || null
        }
    );
    useEffect(() => {
        if (storedToken && !decoded) {
            localStorage.removeItem("token");
            setAuth({
                token: null,
                userRole: null,
                userId: null,
                userName:null
            })
        }
    }, [storedToken, decoded]); //  Add dependencies

    const LoginHandler = (data) => {
        const { token } = data
        // to create token on localstorage
        localStorage.setItem('token', token)
        const decodeToken = token ? jwtDecode(token) : null
        const userRole = decodeToken?.role
        const userId = decodeToken?.id
        const userName = decodeToken?.name;
        // since it contains same name as it is given in state and variable
        setAuth(
            {
                token, userRole, userId, userName
            }
        )
    }
    const LogoutHandler = () => {
        localStorage.removeItem("token");
        setAuth({ token: null, userRole: null, userId: null });
    };

    console.log(auth, ":auth")
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