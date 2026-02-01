export default function AttendeesModal({
  attendees,
  eventName,
  ticketSales,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Attendees - {eventName}</h3>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-blue-800">
            Ticket Sales: {ticketSales ?? attendees.length} / {attendees.length}
          </p>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {attendees.length === 0 ? (
            <p className="text-gray-500 text-sm">No attendees yet</p>
          ) : (
            attendees.map((b) => (
              <div
                key={b.bookingId}
                className="flex justify-between items-center p-2 border rounded bg-gray-50"
              >
                <div>
                  <p className="font-medium">{b.user?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-500">{b.user?.email}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    b.paymentStatus === "SUCCESS"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {b.paymentStatus === "SUCCESS" ? "PAID" : (b.paymentStatus || "PENDING")}
                </span>
              </div>
            ))
          )}
        </div>

        <button
          className="mt-4 btn-secondary w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
