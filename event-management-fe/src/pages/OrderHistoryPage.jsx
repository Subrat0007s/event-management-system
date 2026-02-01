import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../api/orderApi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getUserOrders(user.userId);
      const ordersData = response.data.orders || [];

      console.log("Orders fetched successfully:", ordersData);
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);

      // Handle specific error cases
      let errorMessage = "Failed to fetch orders. Please try again.";

      if (err.response) {
        // Server responded with error status
        if (err.response.status === 404) {
          errorMessage = "User not found. Please check your login.";
        } else if (err.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      setError(errorMessage);

      // Show demo orders as fallback
      console.log(
        "Backend not available, showing demo orders for demonstration",
      );
      const demoOrders = createDemoOrders();
      setOrders(demoOrders);
      console.log("Demo orders created:", demoOrders);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to create demo orders
  const createDemoOrders = () => {
    return [
      {
        orderId: `demo_order_${Date.now()}_1`,
        userId: user.userId,
        paymentId: `pay_card_${Date.now()}`,
        paymentMethod: "card",
        items: [
          {
            eventId: "demo_event_1",
            eventName: "Tech Conference 2024",
            venue: "Convention Center",
            eventDate: "2024-03-15",
            eventTime: "09:00",
            ticketPrice: 500,
            quantity: 2,
          },
        ],
        attendees: [
          {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            eventId: "demo_event_1",
            eventName: "Tech Conference 2024",
          },
          {
            firstName: "Jane",
            lastName: "Doe",
            email: "jane@example.com",
            eventId: "demo_event_1",
            eventName: "Tech Conference 2024",
          },
        ],
        totalAmount: 1000,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
      {
        orderId: `demo_order_${Date.now()}_2`,
        userId: user.userId,
        paymentId: `pay_upi_${Date.now()}`,
        paymentMethod: "upi",
        items: [
          {
            eventId: "demo_event_2",
            eventName: "Music Festival 2024",
            venue: "Central Park",
            eventDate: "2024-04-20",
            eventTime: "18:00",
            ticketPrice: 300,
            quantity: 1,
          },
        ],
        attendees: [
          {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            eventId: "demo_event_2",
            eventName: "Music Festival 2024",
          },
        ],
        totalAmount: 300,
        status: "confirmed",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      },
    ];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order History
            </h1>
            <p className="text-gray-600">View and manage your event bookings</p>
          </div>
          <button
            className="btn-secondary"
            onClick={fetchOrders}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refreshing...
              </span>
            ) : (
              "Refresh Orders"
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              className="mt-2 text-red-600 underline text-sm"
              onClick={fetchOrders}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Demo Orders Indicator */}
        {orders.length > 0 &&
          (orders[0].orderId?.startsWith("demo_order_") ||
            orders[0].orderId?.includes("demo_order_")) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-amber-800 mb-2">
                🧪 Demo Mode Active
              </h4>
              <p className="text-sm text-amber-700 mb-3">
                You're viewing demo orders because the backend database is not
                connected. These orders are for demonstration purposes only.
              </p>
              <div className="flex gap-2">
                <button
                  className="text-amber-700 underline text-sm"
                  onClick={() => {
                    console.log("Current orders:", orders);
                    alert(
                      `Found ${orders.length} demo orders. Check console for details.`,
                    );
                  }}
                >
                  Debug Orders
                </button>
                <button
                  className="text-amber-700 underline text-sm"
                  onClick={() => {
                    const newDemoOrders = createDemoOrders();
                    setOrders(newDemoOrders);
                    console.log("Refreshed demo orders:", newDemoOrders);
                  }}
                >
                  Refresh Demo
                </button>
              </div>
            </div>
          )}

        {/* Debug Panel for Development */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">🔧 Debug Panel</h4>
            <div className="flex gap-2 flex-wrap">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => {
                  console.log("User ID:", user?.userId);
                  console.log("Orders:", orders);
                  console.log("Loading:", loading);
                }}
              >
                Log State
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => {
                  const demoOrders = createDemoOrders();
                  setOrders(demoOrders);
                  console.log("Force added demo orders:", demoOrders);
                }}
              >
                Force Demo Orders
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => {
                  setOrders([]);
                  console.log("Cleared all orders");
                }}
              >
                Clear Orders
              </button>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't booked any events yet
            </p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Browse Events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.orderId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status || "Confirmed"}
                      </span>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ₹{order.totalAmount?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>

                  {/* Event Items */}
                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-4"
                      >
                        <h4 className="font-semibold text-gray-900">
                          {item.eventName}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📍 {item.venue}</p>
                          <p>
                            📅 {new Date(item.eventDate).toLocaleDateString()} •
                            🕐 {item.eventTime}
                          </p>
                          <p>
                            🎫 {item.quantity} ticket(s) × ₹{item.ticketPrice}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Attendees */}
                  {order.attendees && order.attendees.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Attendees
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {order.attendees.map((attendee, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            <span className="font-medium">
                              {attendee.firstName} {attendee.lastName}
                            </span>
                            <span className="text-gray-400 ml-2">
                              ({attendee.email})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <p>Payment ID: {order.paymentId}</p>
                        <p>Total Tickets: {order.attendees?.length || 0}</p>
                      </div>
                      <button
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={() => setSelectedOrder(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div>
                    <h3 className="font-semibold mb-2">Order Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p>
                        <span className="font-medium">Order ID:</span>{" "}
                        {selectedOrder.orderId}
                      </p>
                      <p>
                        <span className="font-medium">Payment ID:</span>{" "}
                        {selectedOrder.paymentId}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}
                        >
                          {selectedOrder.status || "Confirmed"}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Total Amount:</span> ₹
                        {selectedOrder.totalAmount?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>

                  {/* Events */}
                  <div>
                    <h3 className="font-semibold mb-2">Events</h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-semibold">{item.eventName}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>📍 {item.venue}</p>
                            <p>
                              📅 {new Date(item.eventDate).toLocaleDateString()}{" "}
                              • 🕐 {item.eventTime}
                            </p>
                            <p>
                              🎫 {item.quantity} tickets × ₹{item.ticketPrice} =
                              ₹{(item.quantity * item.ticketPrice).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attendees */}
                  <div>
                    <h3 className="font-semibold mb-2">Attendee Information</h3>
                    <div className="space-y-2">
                      {selectedOrder.attendees?.map((attendee, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium">
                            {attendee.firstName} {attendee.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {attendee.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Event: {attendee.eventName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    className="btn-primary flex-1"
                    onClick={() => {
                      // Download ticket functionality
                      alert(
                        "Ticket download functionality would be implemented here",
                      );
                    }}
                  >
                    Download Tickets
                  </button>
                  <button
                    className="btn-secondary flex-1"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
