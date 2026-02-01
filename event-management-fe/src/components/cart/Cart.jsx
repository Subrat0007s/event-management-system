import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const [attendees, setAttendees] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    cartItems,
    showCart,
    setShowCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.ticketPrice * item.quantity,
    0,
  );
  const totalTickets = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAttendeeChange = (eventId, ticketIndex, field, value) => {
    const key = `${eventId}-${ticketIndex}`;
    setAttendees((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const generateAttendeeInputs = (item) => {
    const inputs = [];
    for (let i = 0; i < item.quantity; i++) {
      const key = `${item.eventId}-${i}`;
      inputs.push(
        <div key={key} className="border rounded-lg p-3 bg-gray-50">
          <h4 className="font-semibold text-sm mb-2">Ticket {i + 1}</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="First Name"
              className="input text-sm"
              value={attendees[key]?.firstName || ""}
              onChange={(e) =>
                handleAttendeeChange(
                  item.eventId,
                  i,
                  "firstName",
                  e.target.value,
                )
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input text-sm"
              value={attendees[key]?.lastName || ""}
              onChange={(e) =>
                handleAttendeeChange(
                  item.eventId,
                  i,
                  "lastName",
                  e.target.value,
                )
              }
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="input text-sm mt-2 w-full"
            value={attendees[key]?.email || ""}
            onChange={(e) =>
              handleAttendeeChange(item.eventId, i, "email", e.target.value)
            }
          />
        </div>,
      );
    }
    return inputs;
  };

  const handleCheckout = () => {
    // Validate all attendee information
    let isValid = true;
    const attendeeData = [];

    cartItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const key = `${item.eventId}-${i}`;
        const attendee = attendees[key];

        if (!attendee?.firstName || !attendee?.lastName || !attendee?.email) {
          isValid = false;
          alert(
            `Please fill in all attendee information for ${item.eventName}`,
          );
          return;
        }

        attendeeData.push({
          ...attendee,
          eventId: item.eventId,
          eventName: item.eventName,
        });
      }
    });

    if (!isValid) return;

    // Close cart and navigate to payment page
    setShowCart(false);

    // Navigate to enhanced payment page with attendee data
    navigate("/enhanced-payment", {
      state: {
        items: cartItems,
        attendees: attendeeData,
        totalAmount,
      },
    });
  };

  if (!user) {
    // Redirect to home page instead of showing login popup
    navigate("/");
    return null;
  }

  if (!showCart) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setShowCart(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setShowCart(false)}
              >
                ✕
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.eventId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {item.eventName}
                          </h3>
                          <p className="text-sm text-gray-500">{item.venue}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(item.eventDate).toLocaleDateString()} •{" "}
                            {item.eventTime}
                          </p>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.eventId)}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium">
                            Quantity:
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              className="btn-secondary text-sm px-2 py-1"
                              onClick={() =>
                                updateQuantity(item.eventId, item.quantity - 1)
                              }
                            >
                              -
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="btn-secondary text-sm px-2 py-1"
                              onClick={() =>
                                updateQuantity(item.eventId, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            ₹{item.ticketPrice} × {item.quantity}
                          </p>
                          <p className="font-semibold">
                            ₹{(item.ticketPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Attendee Information */}
                      <div className="border-t pt-3">
                        <h4 className="font-semibold mb-2">
                          Attendee Information
                        </h4>
                        <div className="space-y-2">
                          {generateAttendeeInputs(item)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Total Tickets: {totalTickets}
                      </p>
                      <p className="text-2xl font-bold">
                        Total: ₹{totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <button
                      className="btn-primary px-6 py-3"
                      onClick={handleCheckout}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
