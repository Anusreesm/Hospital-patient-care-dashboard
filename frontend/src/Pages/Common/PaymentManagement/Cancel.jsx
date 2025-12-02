import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../Context/AuthContext";
import { cancelPayment } from "../../../api/PaymentApi";

const CancelPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userRole } = useAuth();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const payment_id = query.get("payment_id");

        if (payment_id) {
            cancelPayment(payment_id)
                .then((res) => {
                    console.log(" Payment cancelled:", res.data);
                })
                .catch((err) => {
                    console.error("Error updating cancel:", err);
                });
        }
    }, [location]);
    const handleBack = () => {
        if (userRole === "admin") navigate("/admin");
        else if (userRole === "staff") navigate("/staff");
        else navigate("/patient/dashboard"); // default for patient
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 dark:bg-gray-900">
            <div className="bg-gray-800 dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center space-y-4 max-w-sm w-full mx-4">
                <div className="w-20 h-20 flex items-center justify-center bg-red-600 rounded-full">
                    <i className="fa-solid fa-xmark text-white text-4xl"></i>
                </div>
                <h1 className="text-2xl font-bold text-red-400 text-center">
                    Payment Cancelled
                </h1>
                <p className="text-gray-300 text-center">
                    Sorry, your payment was not completed.
                </p>
                <button
                    onClick={handleBack}
                    className="mt-4 w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 font-medium"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};
export default CancelPage;
