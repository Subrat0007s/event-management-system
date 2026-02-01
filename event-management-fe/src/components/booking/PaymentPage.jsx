import { useState } from "react";
import loadRazorpay from "../../utils/loadRazorpay";
import { verifyPayment } from "../../api/paymentApi";

export default function PaymentPage({
  amount,
  eventName = "Event Ticket",
  eventId,
  userId,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setError("Invalid amount");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const loaded = await loadRazorpay();

      if (!loaded) {
        setError("Payment SDK failed to load. Please try again.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_xxxxxxxxxx",
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "EventHub",
        description: eventName,
        handler: async function (response) {
          try {
            const verified = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              userId,
              eventId,
            });
            if (verified?.data) {
              onSuccess?.(response);
            } else {
              setError("Payment verification failed");
            }
          } catch (err) {
            setError(err.response?.data?.message || "Verification failed");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : `Pay ₹${Number(amount).toFixed(2)}`}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
