import { useState } from "react";
import { updateEvent } from "../../api/eventApi";

export default function EditEventModal({ event, onClose, onUpdated }) {
  const formatDate = (d) => {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toISOString().slice(0, 10);
  };

  const formatTime = (t) => {
    if (!t) return "";
    if (typeof t === "string") {
      if (t.length >= 5) return t.slice(0, 5);
      return t;
    }
    return t;
  };

  const [form, setForm] = useState({
    eventName: event.eventName || "",
    description: event.description || "",
    venue: event.venue || "",
    eventDate: formatDate(event.eventDate),
    eventTime: formatTime(event.eventTime),
    ticketPrice: String(event.ticketPrice ?? ""),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!form.eventName?.trim() || !form.venue?.trim() || !form.eventDate || !form.eventTime || !form.ticketPrice) {
      setError("Please fill all required fields");
      return;
    }
    const price = parseFloat(form.ticketPrice);
    if (isNaN(price) || price < 0) {
      setError("Invalid ticket price");
      return;
    }
    try {
      setError("");
      setLoading(true);
      await updateEvent(
        event.eventId,
        event.creator?.userId ?? event.creatorId,
        {
          eventName: form.eventName.trim(),
          description: form.description?.trim() || "",
          venue: form.venue.trim(),
          eventDate: form.eventDate,
          eventTime: form.eventTime,
          ticketPrice: price,
        }
      );
      onUpdated?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4 shadow-xl">
        <h3 className="text-xl font-bold mb-4">Edit Event</h3>

        <input
          className="input mb-3"
          placeholder="Event Name *"
          value={form.eventName}
          onChange={(e) => setForm({ ...form, eventName: e.target.value })}
        />

        <textarea
          className="input mb-3 min-h-[80px]"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="input mb-3"
          placeholder="Venue / Location *"
          value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            className="input"
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
          />
          <input
            className="input"
            type="time"
            value={form.eventTime}
            onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
          />
        </div>

        <input
          className="input mb-4"
          type="number"
          min="0"
          step="0.01"
          placeholder="Ticket Price (₹) *"
          value={form.ticketPrice}
          onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            className="btn-secondary flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn-primary flex-1"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
