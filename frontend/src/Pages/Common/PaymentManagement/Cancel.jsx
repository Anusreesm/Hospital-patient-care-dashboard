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
        <div className="flex flex-col justify-center items-center h-screen space-y-6">
            <h1 className="text-2xl font-semibold text-red-600">
                Payment cancelled sorry

            </h1>

            <button
                onClick={handleBack}
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
            >
                Back to Dashboard
            </button>
        </div>
    );
};
export default CancelPage;
