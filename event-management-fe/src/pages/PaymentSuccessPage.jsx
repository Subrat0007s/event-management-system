import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId, items, attendees, totalAmount } = location.state || {};

  if (!paymentId) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">Your booking has been confirmed</p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Payment ID</p>
                <p className="font-medium">{paymentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount Paid</p>
                <p className="font-medium">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="text-left mb-8">
            <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const eventAttendees = attendees.filter(
                  (a) => a.eventId === item.eventId,
                );
                return (
                  <div key={item.eventId} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{item.eventName}</h3>
                    <p className="text-sm text-gray-500">{item.venue}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.eventDate).toLocaleDateString()} •{" "}
                      {item.eventTime}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Attendees:</p>
                      {eventAttendees.map((attendee, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {attendee.firstName} {attendee.lastName}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              className="btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/orders")}
            >
              View Order History
            </button>
            <button className="btn-outline" onClick={() => navigate("/")}>
              Browse More Events
            </button>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> A confirmation email has been sent to your
              registered email address with all the booking details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
