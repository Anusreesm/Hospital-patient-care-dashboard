import { useEffect } from "react"
import { createPayment } from "../../../api/PaymentApi"
import Navbar from "../../../Components/Layouts/Navbar"
import Sidebar from "../../../Components/Layouts/Sidebar"
import { loadStripe } from "@stripe/stripe-js"
import { useSearchParams } from "react-router"

 const stripePromise= loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY)
const PaymentManagement = () => {
 const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");
  const amount= searchParams.get("amount")

  useEffect(() => {
    const handleAppointmentPayment = async () => {

      try {
        const stripe = await stripePromise;
        const session = await createPayment({
          appointment_id: appointmentId,
          payment_method: "card",
          description: "Appointment payment",
          amount:amount
        });

        if (session?.url) {
          window.location.href = session.url;
        } else if (session?.id) {
          await stripe.redirectToCheckout({ sessionId: session.id });
        }
      } catch (error) {
        console.error("Error redirecting to Stripe:", error);
      }
    };
    handleAppointmentPayment();
  }, [appointmentId,amount]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
     
      </div>
    </div>
  );
};

export default PaymentManagement;