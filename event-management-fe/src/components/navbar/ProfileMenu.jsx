import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function ProfileMenu({ user }) {
  const { logout } = useContext(AuthContext);
  const { setShowCart, totalItems } = useCart();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const displayName = user.name || user.email || "User";

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        onClick={() => setOpen(!open)}
      >
        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 transition ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setShowCart(true);
                setOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                    {totalItems}
                  </span>
                )}
              </div>
            </button>
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/orders"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Order History
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
