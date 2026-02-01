import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookTicket } from "../api/ticketApi";
import { createBooking } from "../api/bookingApi";
import { createOrder } from "../api/orderApi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const { items, attendees, totalAmount } = location.state || {};

  useEffect(() => {
    if (!items || !attendees) {
      navigate("/");
      return;
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [items, attendees, navigate]);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError("Payment gateway is loading. Please wait...");
      return;
    }

    if (!user) {
      setError("Please login to continue");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // TEST MODE - Bypass actual payment for testing
      if (
        process.env.NODE_ENV === "development" ||
        window.location.hostname === "localhost"
      ) {
        console.log("TEST MODE: Bypassing actual payment...");

        // Simulate successful payment
        const mockPaymentId = "pay_test_" + Date.now();

        try {
          // Process bookings without actual payment
          const bookingPromises = items.map((item) => {
            const eventAttendees = attendees.filter(
              (a) => a.eventId === item.eventId,
            );

            const bookingData = {
              eventId: item.eventId,
              userId: user.userId,
              attendeeNames: eventAttendees
                .map((a) => `${a.firstName} ${a.lastName}`)
                .join(", "),
              attendeeEmails: eventAttendees.map((a) => a.email).join(", "),
              quantity: item.quantity,
              amount: item.ticketPrice * item.quantity,
            };

            console.log("TEST MODE: Making booking for:", bookingData);
            return createBooking(bookingData);
          });

          const results = await Promise.allSettled(bookingPromises);

          const failedBookings = results.filter(
            (result) => result.status === "rejected",
          );
          if (failedBookings.length > 0) {
            console.error("TEST MODE: Some bookings failed:", failedBookings);
            setError(
              "Test booking completed with some issues. Check console for details.",
            );
          }

          // Create order record
          try {
            const orderData = {
              userId: user.userId,
              paymentId: mockPaymentId,
              items: items,
              attendees: attendees,
              totalAmount: totalAmount,
              status: "confirmed",
            };

            const orderResponse = await createOrder(orderData);
            console.log("Order created:", orderResponse.data);
          } catch (orderError) {
            console.error("Failed to create order:", orderError);
            // Continue anyway - payment was successful
          }

          // Navigate to success page
          navigate("/payment-success", {
            state: {
              paymentId: mockPaymentId,
              items,
              attendees,
              totalAmount,
            },
          });
          // Clear cart after successful payment
          clearCart();
        } catch (err) {
          console.error("TEST MODE: Booking error:", err);
          setError(
            `Test booking failed: ${err.message || err.response?.data?.message || "Unknown error"}`,
          );
        } finally {
          setLoading(false);
        }
        return;
      }

      // PRODUCTION MODE - Actual Razorpay payment
      const options = {
        key: "rzp_test_1DP5mmOlF5G1ag", // Test key
        amount: totalAmount * 100, // Convert to paise
        currency: "INR",
        name: "Event Hub",
        description: `Payment for ${items.length} event(s)`,
        image: "https://via.placeholder.com/100x100/6366f1/white?text=EH",
        handler: async function (response) {
          try {
            console.log(
              "Payment successful! Payment ID:",
              response.razorpay_payment_id,
            );
            console.log("Booking data:", { items, attendees, user });

            // Process each ticket booking
            const bookingPromises = items.map((item) => {
              const eventAttendees = attendees.filter(
                (a) => a.eventId === item.eventId,
              );

              const bookingData = {
                eventId: item.eventId,
                userId: user.userId,
                attendeeNames: eventAttendees
                  .map((a) => `${a.firstName} ${a.lastName}`)
                  .join(", "),
                attendeeEmails: eventAttendees.map((a) => a.email).join(", "),
                quantity: item.quantity,
                amount: item.ticketPrice * item.quantity,
              };

              console.log("Making booking for:", bookingData);

              return createBooking(bookingData);
            });

            const results = await Promise.allSettled(bookingPromises);

            // Check if any bookings failed
            const failedBookings = results.filter(
              (result) => result.status === "rejected",
            );
            if (failedBookings.length > 0) {
              console.error("Some bookings failed:", failedBookings);
              // Still proceed to success page but show warning
              setError(
                "Payment successful! Some bookings may need manual confirmation.",
              );
            }

            // Create order record
            try {
              const orderData = {
                userId: user.userId,
                paymentId: response.razorpay_payment_id,
                items: items,
                attendees: attendees,
                totalAmount: totalAmount,
                status: "confirmed",
              };

              const orderResponse = await createOrder(orderData);
              console.log("Order created:", orderResponse.data);
            } catch (orderError) {
              console.error("Failed to create order:", orderError);
              // Continue anyway - payment was successful
            }

            // Navigate to success page
            navigate("/payment-success", {
              state: {
                paymentId: response.razorpay_payment_id,
                items,
                attendees,
                totalAmount,
              },
            });

            // Clear cart after successful payment
            clearCart();
          } catch (err) {
            console.error("Booking error:", err);
            setError(
              `Payment successful but booking failed: ${err.message || err.response?.data?.message || "Unknown error"}`,
            );
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        notes: {
          address: "Event Hub Booking",
          events: items.map((item) => item.eventName).join(", "),
          attendees: attendees
            .map((a) => `${a.firstName} ${a.lastName} (${a.email})`)
            .join(", "),
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
          escape: true,
          handleback: true,
          confirm_close: true,
          animation: "slideFromBottom",
        },
        config: {
          display: {
            blocks: {
              utm: {
                name: "razorpay-utm-block",
              },
            },
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      // Add error handling
      razorpay.on("payment.failed", function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpay.open();
    } catch (err) {
      setError("Payment initialization failed. Please try again.");
      console.error("Payment error:", err);
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
                {error.includes("TEST MODE") && (
                  <p className="text-sm text-red-500 mt-2">
                    This is a test mode payment. No actual charges were made.
                  </p>
                )}
              </div>
            )}

            {(process.env.NODE_ENV === "development" ||
              window.location.hostname === "localhost") && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-amber-800 mb-2">
                  🧪 Test Mode Active
                </h4>
                <p className="text-sm text-amber-700">
                  You're in test mode. No actual payment will be processed. This
                  simulates the payment flow for testing purposes.
                </p>
              </div>
            )}

            <button
              className="btn-primary w-full py-4 text-lg font-semibold"
              onClick={handlePayment}
              disabled={loading || !razorpayLoaded}
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
              ) : !razorpayLoaded ? (
                "Loading Payment Gateway..."
              ) : process.env.NODE_ENV === "development" ||
                window.location.hostname === "localhost" ? (
                `Test Pay ₹${totalAmount.toFixed(2)}`
              ) : (
                `Pay ₹${totalAmount.toFixed(2)}`
              )}
            </button>

            <div className="mt-4 text-center">
              <button
                className="text-gray-500 hover:text-gray-700 text-sm"
                onClick={() => navigate(-1)}
              >
                ← Back to Cart
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
              Secure payment powered by Razorpay
            </div>

            {/* Troubleshooting Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">
                Payment Not Working?
              </h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Disable ad-blockers for this site</li>
                <li>• Try refreshing the page and retry</li>
                <li>• Use a different browser if issues persist</li>
                <li>• Check your internet connection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
