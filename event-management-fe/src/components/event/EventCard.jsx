import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function EventCard({ event, onView, onBookEvent }) {
  const { user } = useContext(AuthContext);
  const formatDate = (d) => {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (t) => {
    if (!t) return "";
    if (typeof t === "string" && t.includes(":")) return t.slice(0, 5);
    return t;
  };

  return (
    <div
      className="card hover:shadow-xl transition cursor-pointer group"
      onClick={() => onView?.(event)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
          {event.eventName}
        </h3>
        <span className="text-sm font-bold text-blue-600">
          ₹ {Number(event.ticketPrice ?? 0).toFixed(0)}
        </span>
      </div>
      <p className="text-sm text-gray-500 line-clamp-1">{event.venue}</p>
      <p className="text-sm mt-1 text-gray-600">
        {formatDate(event.eventDate)} • {formatTime(event.eventTime)}
      </p>
      {event.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {event.description}
        </p>
      )}
      <div className="flex gap-2 mt-4">
        <button
          className="btn-primary flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onView?.(event);
          }}
        >
          View Details
        </button>

        {user && user.userId !== event.creator?.userId && (
          <button
            className="btn-secondary flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onBookEvent?.(event);
            }}
          >
            Book Event
          </button>
        )}
      </div>
    </div>
  );
}
