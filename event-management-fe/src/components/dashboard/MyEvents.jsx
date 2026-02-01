import { useEffect, useState, useContext } from "react";
import { getMyEvents } from "../../api/eventApi";
import { AuthContext } from "../../context/AuthContext";
import EventMenu from "./EventMenu";
import EventCard from "../event/EventCard";
import BookTicketModal from "../booking/BookTicketModal";
import QASection from "./QASection";

export default function MyEvents() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showQA, setShowQA] = useState(false);

  const refresh = () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    getMyEvents(user.userId)
      .then((res) => {
        setEvents(res.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setError(error.response?.data?.message || "Failed to load events");
        setEvents([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) {
      refresh();
    } else {
      setLoading(false); // Set loading to false if no user
    }
  }, [user?.userId]);

  if (!user) {
    return (
      <div className="text-center py-12 text-gray-500">
        Please login to manage your events
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading your events...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-xl">
        <p className="text-red-600 mb-2">Error loading events</p>
        <p className="text-sm text-red-500 mb-4">{error}</p>
        <button onClick={refresh} className="btn-secondary" disabled={loading}>
          Try Again
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-600 mb-2">You haven't created any events yet</p>
        <p className="text-sm text-gray-500">
          Create your first event from the navbar
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((e) => {
        const isOrganizer = user?.userId === e.creator?.userId;

        return (
          <div
            key={e.eventId}
            className="card hover:shadow-lg transition flex flex-col"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold flex-1">{e.eventName}</h3>
              {isOrganizer && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  Your Event
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{e.venue}</p>
            <p className="text-sm mt-1">
              {e.eventDate} • {e.eventTime}
            </p>
            <p className="text-sm font-semibold text-blue-600 mt-1">
              ₹ {Number(e.ticketPrice).toFixed(2)}
            </p>
            {!isOrganizer && (
              <p className="text-xs text-gray-400 mt-1">
                by {e.creator?.name || e.creator?.email}
              </p>
            )}

            <div className="mt-auto pt-3">
              {isOrganizer ? (
                <EventMenu
                  event={e}
                  userId={user.userId}
                  onEdit={refresh}
                  onDelete={refresh}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    className="btn-primary text-sm py-1 px-2"
                    onClick={() => {
                      setSelectedEvent(e);
                      setShowBooking(true);
                    }}
                  >
                    Book Ticket
                  </button>
                  <button
                    className="btn-secondary text-sm py-1 px-2"
                    onClick={() => {
                      setSelectedEvent(e);
                      setShowQA(true);
                    }}
                  >
                    Ask Question
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Booking Modal */}
      {showBooking && selectedEvent && (
        <BookTicketModal
          eventId={selectedEvent.eventId}
          userId={user.userId}
          event={selectedEvent}
          onClose={() => {
            setShowBooking(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {/* Q&A Modal */}
      {showQA && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Q&A - {selectedEvent.eventName}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => {
                    setShowQA(false);
                    setSelectedEvent(null);
                  }}
                >
                  ✕
                </button>
              </div>

              <QASection
                eventId={selectedEvent.eventId}
                userId={user.userId}
                isOrganizer={false}
                creatorId={selectedEvent.creator?.userId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
