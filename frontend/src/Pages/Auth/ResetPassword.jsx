import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../Components/Button";
import Input from "../../Components/Forms/Input";
import { useState } from "react";
import toast from "react-hot-toast";
import { resetPw } from "../../api/AuthApi";

const ResetPassword=()=>{
   const { token } = useParams();         // GET token from URL
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const result = await resetPw(token, { password: newPassword });

        if (result.success) {
            toast.success("Password reset successful!");
            navigate("/");
        } else {
            toast.error(result.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center p-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Reset Password</h1>
                <p className="text-gray-600 mb-8 text-sm">
                    Enter your new password below
                </p>

                <form
                    className="rounded-lg border bg-white text-gray-900 shadow-sm w-full max-w-md p-8"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-4 mb-4">
                        <div>
                            <p className="font-bold text-black">New Password</p>
                            <Input
                                type="password"
                                placeholder="Enter new password"
                                required
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <p className="font-bold text-black">Confirm Password</p>
                            <Input
                                type="password"
                                placeholder="Confirm new password"
                                required
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit">Reset Password</Button>

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

export default ResetPassword