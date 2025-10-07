import { useState } from "react"
import Button from "../../Components/Button"
import Input from "../../Components/Forms/Input"
import { LoginUser } from "../../api/AuthApi"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Context/AuthContext"


const Login = () => {

    // destructing useAuth- need to call LoginHandler so need to call custom hook useAuth
    const { LoginHandler } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await LoginUser({ email, password })
            if (result.success) {
                
                // it is passed to AuthContext-passed as an object
                LoginHandler(
                    {
                        token: result?.data?.token
                    }
                )
                if (result?.data?.role === 'admin') {
                    navigate('/admin')
                } else if (result?.data?.role === 'staff') {
                    navigate('/staff')
                }
                else if (result?.data?.role === 'doctor') {
                    navigate('/doctor')
                }
                else if (result?.data?.role === 'patient') {
                    navigate('/patient')
                }
                else {
                    navigate('/login')
                }
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <>
           <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
                <div className="flex flex-col items-center justify-center p-18 ">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">MedTech HMS</h1>
                    </div>
                    <p className="text-gray-600 mb-10 text-sm">Hospital Management System</p>
                    <form className="rounded-lg border bg-white  text-gray-900  shadow-sm w-full max-w-md p-8"
                        onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3 mb-4">
                            <p className="text-xl font-semibold  text-black">Sign In</p>
                            <span className="text-gray-400 text-sm">Access your hospital management dashboard</span>
                            <div>
                                <p className="font-bold text-black ">Email</p>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="enter you email"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <p className="font-bold text-black">Password</p>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="enter your password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit"  >
                            Sign In
                        </Button>
                    </form>
                </div>
            </div>

        </>
    )
}
export default Login