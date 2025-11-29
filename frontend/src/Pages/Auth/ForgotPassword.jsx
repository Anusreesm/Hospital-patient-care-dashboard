import { Link } from "react-router-dom";
import Button from "../../Components/Button";
import Input from "../../Components/Forms/Input";
import toast from "react-hot-toast";
import { forgotPw } from "../../api/AuthApi";
import { useState } from "react";

const ForgotPassword = () => {
      const [email, setEmail] = useState("");
    const handleSubmit=async (e)=>{
      e.preventDefault();

        try {
            const result = await forgotPw({ email });

            if (result?.success) {
                toast.success("Reset link sent to your email!");
            } else {
                toast.error(result?.message || "Something went wrong");
            }
        } 
    catch(err)
    {
        console.log(err)
    }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center p-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Forgot Password</h1>
                <p className="text-gray-600 mb-8 text-sm">
                    Enter your email to receive a reset link
                </p>

                <form
                    className="rounded-lg border bg-white text-gray-900 shadow-sm w-full max-w-md p-8"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-4 mb-4">
                        <div>
                            <p className="font-bold text-black">Email</p>
                            <Input
                                type="email"
                                placeholder="Enter your registered email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit">Send Reset Link</Button>

                    <div className="flex justify-center mt-4">
                        <Link
                            to="/"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
