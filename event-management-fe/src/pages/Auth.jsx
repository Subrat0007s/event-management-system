import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!isRegister ? (
        <LoginForm switchMode={() => setIsRegister(true)} />
      ) : (
        <RegisterForm switchMode={() => setIsRegister(false)} />
      )}
    </div>
  );
}
