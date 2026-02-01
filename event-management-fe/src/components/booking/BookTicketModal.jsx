import { useState, useContext } from "react";
import PaymentPage from "./PaymentPage";
import { bookTicket } from "../../api/ticketApi";
import { AuthContext } from "../../context/AuthContext";

export default function BookTicketModal({ eventId, userId, event, onClose }) {
  const { user } = useContext(AuthContext);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amount = event?.ticketPrice ? Number(event.ticketPrice) : 0;

  const handlePaymentSuccess = async (paymentData) => {
    try {
      setLoading(true);
      setError("");
      await bookTicket(user?.userId ?? userId, eventId);
      setPaid(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  if (!user && !userId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Book Ticket - {event?.eventName || "Event"}
            </h2>
            {onClose && (
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={onClose}
              >
                ✕
              </button>
            )}
          </div>

          {!paid ? (
            <>
              <PaymentPage
                amount={amount}
                eventName={event?.eventName || "Event Ticket"}
                eventId={eventId}
                userId={user?.userId ?? userId}
                onSuccess={handlePaymentSuccess}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-700 font-semibold">
                Ticket booked successfully 🎉
              </p>
              <p className="text-sm text-green-600 mt-1">
                Check your email for confirmation
              </p>
              {onClose && (
                <button className="btn-primary mt-4" onClick={onClose}>
                  Close
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
