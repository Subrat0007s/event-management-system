import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="p-6 max-w-xl mx-auto text-center py-16">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        Page not found
      </h2>
      <p className="text-gray-500 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        Go to Home
      </Link>
    </div>
  );
}
