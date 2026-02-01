import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MyEvents from "./MyEvents";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Event Management Dashboard
          </h2>
          <p className="text-gray-500">Please login to manage your events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Events Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage your events, book tickets, and interact with other events
          through Q&A
        </p>
      </div>

      <MyEvents />
    </div>
  );
}
