import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AuthModal from "../auth/AuthModal";
import CreateEventModal from "../event/CreateEventModal";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const handleEventCreated = () => {
    setShowCreateEvent(false);
    window.location.href = "/dashboard";
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-40">
      <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
        EventHub
      </Link>

      <div className="flex gap-3 items-center">
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-600 font-medium"
        >
          Events
        </Link>

        {user && (
          <>
            <Link
              to="/dashboard"
              className="btn-secondary"
            >
              Dashboard
            </Link>
            <button
              className="btn-primary"
              onClick={() => setShowCreateEvent(true)}
            >
              Create Event
            </button>
            <ProfileMenu user={user} />
          </>
        )}

        {!user && <AuthModal />}
      </div>

      {showCreateEvent && (
        <CreateEventModal
          onClose={() => setShowCreateEvent(false)}
          onCreated={handleEventCreated}
        />
      )}
    </nav>
  );
}
