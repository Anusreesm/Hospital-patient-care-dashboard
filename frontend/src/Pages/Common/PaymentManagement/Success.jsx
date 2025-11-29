import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { useEffect } from "react";
import { successPayment } from "../../../api/PaymentApi";


 
const SuccessPage = () => {
    const navigate = useNavigate();
    const location =useLocation();
 const {  userRole } = useAuth();

useEffect(() => {
    const query = new URLSearchParams(location.search);
    const session_id = query.get("session_id");

    if (session_id) {
      successPayment(session_id)
        .then((res) => {
          if (res.success) console.log("Payment updated:", res);
          else console.error(" Payment update failed:", res.message);
        })
        .catch((err) => console.error("API error:", err));
    }
  }, [location]);


const handleBack = () => {
    if (userRole === "admin") navigate("/admin");
    else if (userRole === "staff") navigate("/staff");
    else navigate("/patient"); // default for patient
  };

 return (
    <div className="flex flex-col justify-center items-center h-screen space-y-6">
      <h1 className="text-2xl font-semibold text-green-600">
        Payment Successful 
        
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

export default SuccessPage;