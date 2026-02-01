import { useState } from "react";
import { registerUser } from "../../api/authApi";

export default function RegisterForm({ switchMode, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    if (!/(?=.*[a-z])/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/(?=.*\d)/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleRegister = async () => {
    try {
      setError("");

      // Validate password
      if (!validatePassword(form.password)) {
        return;
      }

      await registerUser(form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Check Your Email
        </h3>
        <p className="text-gray-600 mb-4">
          We've sent a verification link to <strong>{form.email}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Click the link in the email to verify your account and start using the
          platform.
        </p>
        <button
          className="text-blue-600 hover:underline text-sm font-medium"
          onClick={() => {
            setSuccess(false);
            setForm({
              name: "",
              dob: "",
              email: "",
              password: "",
            });
            setPasswordError("");
            setError("");
          }}
        >
          Register with different email
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Create account
      </h2>

      <div className="space-y-4">
        <input
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div className="relative">
          <input
            className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            type="date"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            max={new Date().toISOString().split("T")[0]}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
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

        <input
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="relative">
          <input
            className={`w-full px-4 py-3 pr-12 rounded-xl border bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              passwordError
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-200"
            }`}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (passwordError) validatePassword(e.target.value);
            }}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ) : (
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
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            )}
          </button>
        </div>

        {passwordError && (
          <div className="text-red-500 text-xs mt-1">{passwordError}</div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>Password must contain:</p>
          <ul className="list-disc list-inside space-y-1">
            <li className={form.password.length >= 6 ? "text-green-600" : ""}>
              At least 6 characters
            </li>
            <li
              className={
                /(?=.*[a-z])/.test(form.password) ? "text-green-600" : ""
              }
            >
              One lowercase letter
            </li>
            <li
              className={
                /(?=.*[A-Z])/.test(form.password) ? "text-green-600" : ""
              }
            >
              One uppercase letter
            </li>
            <li
              className={/(?=.*\d)/.test(form.password) ? "text-green-600" : ""}
            >
              One number
            </li>
          </ul>
        </div>
      </div>

      <button
        className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/25"
        onClick={handleRegister}
      >
        Register
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}

      <p
        className="text-sm mt-4 text-center text-blue-600 cursor-pointer hover:underline font-medium"
        onClick={switchMode}
      >
        Already have an account? Login
      </p>
    </div>
  );
}
