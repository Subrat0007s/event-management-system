import { useState } from "react";
import { verifyOtp, resendOtp } from "../../api/authApi";

export default function OtpInput({ email, userId, onVerified }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    try {
      setError("");
      await verifyOtp(email, otp);
      onVerified();
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError("");
      await resendOtp(email);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
        Verify OTP
      </h2>
      <p className="text-sm text-gray-500 mb-4 text-center">
        We sent a code to {email}
      </p>

      <input
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-lg tracking-widest"
        placeholder="Enter 6-digit OTP"
        value={otp}
        maxLength={6}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
      />

      <button
        className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/25"
        onClick={handleVerify}
      >
        Verify OTP
      </button>

      <button
        className="w-full mt-3 py-2 text-blue-600 font-medium hover:underline disabled:opacity-50"
        onClick={handleResend}
        disabled={resending}
      >
        {resending ? "Sending..." : "Resend OTP"}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
      )}
    </div>
  );
}
