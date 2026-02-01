import { useState, useContext } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SocialLogin from "./SocialLogin";
import { AuthContext } from "../../context/AuthContext";

export default function AuthModal() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const closeModal = () => {
    setOpen(false);
    setIsRegister(false);
  };

  if (user) return null;

  return (
    <>
      <button
        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/25"
        onClick={() => setOpen(true)}
      >
        Login / Register
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 pointer-events-none" />
            <div className="relative p-8">
              <button
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
                onClick={closeModal}
              >
                ✕
              </button>

              {!isRegister ? (
                <LoginForm
                  switchMode={() => setIsRegister(true)}
                  onSuccess={closeModal}
                />
              ) : (
                <RegisterForm
                  switchMode={() => setIsRegister(false)}
                  onSuccess={closeModal}
                />
              )}

              <div className="mt-6 pt-6 border-t border-gray-200/80">
                <SocialLogin />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
