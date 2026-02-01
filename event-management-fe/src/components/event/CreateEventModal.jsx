import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createEvent } from "../../api/eventApi";
import { EventCategory, PrivacySettings } from "../../utils/constants";

export default function CreateEventModal({ onClose, onCreated }) {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    eventName: "",
    description: "",
    venue: "",
    eventDate: "",
    eventTime: "",
    ticketPrice: "",
    eventCategory: "OTHER",
    privacySettings: "PUBLIC",
    eventImageUrl: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);

  if (!user) return null;

  const handleCreate = async () => {
    if (
      !form.eventName?.trim() ||
      !form.venue?.trim() ||
      !form.eventDate ||
      !form.eventTime ||
      !form.ticketPrice
    ) {
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
      await createEvent(
        {
          eventName: form.eventName.trim(),
          description: form.description?.trim() || "",
          venue: form.venue.trim(),
          eventDate: form.eventDate,
          eventTime: form.eventTime,
          ticketPrice: price,
          maxAttendees: 100,
          eventImageUrl: form.eventImageUrl || "",
          eventCategory: form.eventCategory,
          privacySettings: form.privacySettings,
          creatorId: user.userId,
        },
        user.userId,
      );
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4 shadow-xl">
        <h3 className="text-xl font-bold mb-4">Create Event</h3>

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
          <div className="relative">
            <input
              className="input"
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <input
              className="input pr-10 cursor-pointer"
              type="text"
              value={form.eventTime}
              placeholder="Select time"
              onClick={() => setShowTimePicker(!showTimePicker)}
              readOnly
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {showTimePicker && (
              <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, "0");
                    return (
                      <button
                        key={hour}
                        className="px-2 py-1 text-xs border rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        onClick={() => {
                          setForm({ ...form, eventTime: `${hour}:00` });
                          setShowTimePicker(false);
                        }}
                      >
                        {hour}:00
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <input
          className="input mb-3"
          type="number"
          min="0"
          step="0.01"
          placeholder="Ticket Price (₹) *"
          value={form.ticketPrice}
          onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Image (Optional)
          </label>
          <div className="space-y-3">
            <div className="relative">
              <input
                className="input pr-10"
                type="url"
                placeholder="Enter image URL (optional)"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setForm({ ...form, eventImageUrl: e.target.value });
                }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Event preview"
                  className="w-full h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200/6366f1/white?text=Event+Image";
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Image preview</p>
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>• Add an image URL to make your event more attractive</p>
              <p>• You can add this later if you don't have one now</p>
              <p>• Use services like Unsplash, Pexels, or any image URL</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <select
            className="input"
            value={form.eventCategory}
            onChange={(e) =>
              setForm({ ...form, eventCategory: e.target.value })
            }
          >
            <option value="">Category</option>
            {Object.values(EventCategory).map((category) => (
              <option key={category} value={category}>
                {category.replace("_", " ")}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={form.privacySettings}
            onChange={(e) =>
              setForm({ ...form, privacySettings: e.target.value })
            }
          >
            <option value="">Privacy</option>
            {Object.values(PrivacySettings).map((privacy) => (
              <option key={privacy} value={privacy}>
                {privacy.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

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
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
