import { useContext } from "react";
import QASection from "../dashboard/QASection";
import { AuthContext } from "../../context/AuthContext";

export default function EventDetails({ event, onClose, onBookEvent }) {
  const { user } = useContext(AuthContext);
  const isOrganizer = user?.userId === event?.creator?.userId;

  const formatDate = (d) => {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (t) => {
    if (!t) return "";
    if (typeof t === "string" && t.includes(":")) return t.slice(0, 5);
    return t;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {event.eventName}
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700 text-2xl"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {event.description && (
            <p className="text-gray-600 mb-4">{event.description}</p>
          )}

          <div className="space-y-2 mb-4">
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">📍</span>
              {event.venue}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">📅</span>
              {formatDate(event.eventDate)}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">🕐</span>
              {formatTime(event.eventTime)}
            </p>
            <p className="text-xl font-bold text-blue-600">
              ₹ {Number(event.ticketPrice).toFixed(2)}
            </p>
          </div>

          {!user && (
            <p className="text-amber-600 text-sm py-2">
              Please login to book tickets
            </p>
          )}

          {user && (
            <div className="mt-6 pt-6 border-t">
              <QASection
                eventId={event.eventId}
                userId={user.userId}
                isOrganizer={isOrganizer}
                creatorId={event.creator?.userId}
              />
            </div>
          )}

          {/* Book Button for non-organizers */}
          {!isOrganizer && user && (
            <div className="mt-6 pt-4 border-t">
              <button
                className="btn-primary w-full"
                onClick={() => {
                  onBookEvent?.(event);
                  onClose();
                }}
              >
                Book Event
              </button>
            </div>
          )}

          <button className="btn-secondary w-full mt-3" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
