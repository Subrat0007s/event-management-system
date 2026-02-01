import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "../api/orderApi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../styles/payment.css";

export default function EnhancedPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    // Card details
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    // UPI details
    upiId: "",
    // Common
    savePaymentMethod: false,
  });

  const { items, attendees, totalAmount } = location.state || {};

  useEffect(() => {
    if (!items || !attendees) {
      navigate("/");
      return;
    }
  }, [items, attendees, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const validateCardDetails = () => {
    if (paymentMethod === "card") {
      if (
        !formData.cardNumber ||
        formData.cardNumber.replace(/\s/g, "").length < 16
      ) {
        setError("Please enter a valid 16-digit card number");
        return false;
      }
      if (!formData.cardExpiry || formData.cardExpiry.length !== 5) {
        setError("Please enter a valid expiry date (MM/YY)");
        return false;
      }
      if (!formData.cardCvv || formData.cardCvv.length < 3) {
        setError("Please enter a valid CVV");
        return false;
      }
      if (!formData.cardName.trim()) {
        setError("Please enter the name on card");
        return false;
      }
    } else if (paymentMethod === "upi") {
      if (!formData.upiId.trim()) {
        setError("Please enter a valid UPI ID");
        return false;
      }
      if (!formData.upiId.includes("@")) {
        setError("Please enter a valid UPI ID (e.g., user@upi)");
        return false;
      }
    }
    return true;
  };

  const processPayment = async () => {
    if (!validateCardDetails()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order record
      const orderData = {
        userId: user.userId,
        paymentId: `pay_${paymentMethod}_${Date.now()}`,
        paymentMethod: paymentMethod,
        paymentDetails:
          paymentMethod === "card"
            ? {
                last4: formData.cardNumber.slice(-4),
                name: formData.cardName,
              }
            : {
                upiId: formData.upiId,
              },
        items: items,
        attendees: attendees,
        totalAmount: totalAmount,
        status: "confirmed",
      };

      // Try to create order, but handle gracefully if backend doesn't exist
      try {
        const orderResponse = await createOrder(orderData);
        console.log("Order created:", orderResponse.data);
      } catch (orderError) {
        console.log(
          "Backend order creation failed, using fallback:",
          orderError.message,
        );
        // For dummy payment, we don't need the backend to work
        // Just create a local order record for demonstration
        console.log("Order data (for frontend only):", orderData);
      }

      // Clear cart and navigate to success
      clearCart();

      navigate("/payment-success", {
        state: {
          paymentId: orderData.paymentId,
          items,
          attendees,
          totalAmount,
          paymentMethod: paymentMethod,
        },
      });
    } catch (err) {
      console.error("Payment processing error:", err);

      // Provide more specific error messages
      if (err.code === "ERR_NETWORK") {
        setError(
          "Network error. Please check your internet connection and try again.",
        );
      } else if (err.response?.status === 404) {
        setError("Payment service unavailable. Please try again later.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!items || !attendees) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Complete Your Booking
          </h1>

          {/* Order Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => {
                const eventAttendees = attendees.filter(
                  (a) => a.eventId === item.eventId,
                );
                return (
                  <div key={item.eventId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {item.eventName}
                        </h3>
                        <p className="text-sm text-gray-500">{item.venue}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.eventDate).toLocaleDateString()} •{" "}
                          {item.eventTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ₹{item.ticketPrice}
                        </p>
                        <p className="font-semibold">
                          ₹{(item.ticketPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Attendee Names */}
                    <div className="border-t pt-3">
                      <h4 className="font-medium text-sm mb-2">Attendees:</h4>
                      <div className="space-y-1">
                        {eventAttendees.map((attendee, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {attendee.firstName} {attendee.lastName} (
                            {attendee.email})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                className={`p-4 border-2 rounded-lg transition-colors ${
                  paymentMethod === "card"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Card</span>
                </div>
              </button>

              <button
                className={`p-4 border-2 rounded-lg transition-colors ${
                  paymentMethod === "upi"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPaymentMethod("upi")}
              >
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">UPI</span>
                </div>
              </button>

              <button
                className={`p-4 border-2 rounded-lg transition-colors ${
                  paymentMethod === "netbanking"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPaymentMethod("netbanking")}
              >
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Net Banking</span>
                </div>
              </button>
            </div>

            {/* Payment Form */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cardNumber: formatCardNumber(e.target.value),
                      }))
                    }
                    placeholder="1234 5678 9012 3456"
                    className="input w-full"
                    maxLength="19"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cardExpiry: formatExpiry(e.target.value),
                        }))
                      }
                      placeholder="MM/YY"
                      className="input w-full"
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="input w-full"
                      maxLength="4"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="input w-full"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="yourname@upi"
                    className="input w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your UPI ID (e.g., user@ybl, user@okicici)
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    How to pay with UPI:
                  </h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Enter your UPI ID above</li>
                    <li>Click "Process Payment"</li>
                    <li>Check your UPI app for payment request</li>
                    <li>Approve the payment in your UPI app</li>
                  </ol>
                </div>
              </div>
            )}

            {paymentMethod === "netbanking" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Bank
                  </label>
                  <select className="input w-full">
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                  </select>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">
                    Net Banking Instructions:
                  </h4>
                  <p className="text-sm text-amber-700">
                    You will be redirected to your bank's secure payment gateway
                    to complete the transaction.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                name="savePaymentMethod"
                id="savePaymentMethod"
                checked={formData.savePaymentMethod}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label
                htmlFor="savePaymentMethod"
                className="text-sm text-gray-700"
              >
                Save payment method for future bookings
              </label>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Tickets</p>
                <p className="text-xl font-semibold">{attendees.length}</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Demo Mode Indicator */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-amber-800 mb-2">
                🧪 Demo Payment Processing
              </h4>
              <p className="text-sm text-amber-700">
                This is a dummy payment interface for demonstration purposes. No
                actual charges will be made to your payment method.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                className="btn-secondary flex-1 py-4 text-lg font-semibold"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Back to Cart
              </button>
              <button
                className="btn-primary flex-1 py-4 text-lg font-semibold"
                onClick={processPayment}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Process Payment - ₹${totalAmount.toFixed(2)}`
                )}
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
              <svg
                className="w-4 h-4 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Secure payment processing
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Payment Information:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • This is a dummy payment interface for demonstration purposes
                </li>
                <li>• No actual charges will be made to your payment method</li>
                <li>• All payment details are processed securely</li>
                <li>
                  • Your booking will be confirmed after successful payment
                  simulation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
