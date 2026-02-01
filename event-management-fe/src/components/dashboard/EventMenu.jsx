import { useState } from "react";
import AttendeesModal from "./AttendeesModal";
import EditEventModal from "../event/EditEventModal";
import { getEventBookings, deleteEvent } from "../../api/eventApi";

export default function EventMenu({ event, userId, onEdit, onDelete }) {
  const [showAttendees, setShowAttendees] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleViewAttendees = async () => {
    try {
      setLoading(true);
      const res = await getEventBookings(event.eventId, userId);
      setAttendees(res.data.data || []);
      setShowAttendees(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load attendees");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(event.eventId, userId);
      onDelete?.();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

  const paidCount = attendees.filter((b) => b.paymentStatus === "SUCCESS").length;

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          className="btn-secondary text-sm py-1 px-2"
          onClick={handleViewAttendees}
          disabled={loading}
        >
          {loading ? "Loading..." : "View Attendees"}
        </button>
        <button
          className="btn-secondary text-sm py-1 px-2"
          onClick={() => setShowEdit(true)}
        >
          Edit Event
        </button>
        <button
          className="btn-danger text-sm py-1 px-2"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {showAttendees && (
        <AttendeesModal
          attendees={attendees}
          eventName={event.eventName}
          ticketSales={paidCount}
          onClose={() => setShowAttendees(false)}
        />
      )}

      {showEdit && (
        <EditEventModal
          event={event}
          onClose={() => setShowEdit(false)}
          onUpdated={() => {
            setShowEdit(false);
            onEdit?.();
          }}
        />
      )}
    </>
  );
}
